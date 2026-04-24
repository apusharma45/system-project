import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorsService } from './doctors.service';

describe('DoctorsService', () => {
  let service: DoctorsService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
  });

  it('getMyProfile returns doctor profile payload', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'd1',
      fullName: 'Dr. Alice',
      email: 'alice@medflow.local',
      role: Role.DOCTOR,
      phone: '+8801700000001',
      address: 'Dhaka',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      professionalProfile: { specialization: 'Cardiology' },
    });

    const result = await service.getMyProfile('d1');
    expect(result.doctor.id).toBe('d1');
    expect(result.doctor.profile.specialization).toBe('Cardiology');
  });

  it('getMyProfile throws when user is not doctor', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'd1',
      role: Role.PATIENT,
    });
    await expect(service.getMyProfile('d1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateMyProfile updates only editable fields', async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: 'd1', role: Role.DOCTOR })
      .mockResolvedValueOnce({
        id: 'd1',
        fullName: 'Dr. Alice Updated',
        email: 'alice@medflow.local',
        role: Role.DOCTOR,
        phone: '+8801700000099',
        address: 'Updated Address',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        professionalProfile: { specialization: 'Cardiology' },
      });

    await service.updateMyProfile('d1', {
      fullName: 'Dr. Alice Updated',
      phone: '+8801700000099',
      address: 'Updated Address',
      about: 'Senior cardiologist',
      clinicName: 'Heart Care Clinic',
      clinicAddress: 'Dhaka',
      clinicPhone: '+8801711111111',
      availableTimeSlots: [
        { day: 'MONDAY', startTime: '09:00', endTime: '12:00' },
      ],
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'd1' },
      data: {
        fullName: 'Dr. Alice Updated',
        phone: '+8801700000099',
        address: 'Updated Address',
        professionalProfile: {
          upsert: {
            create: {
              about: 'Senior cardiologist',
              clinicName: 'Heart Care Clinic',
              clinicAddress: 'Dhaka',
              clinicPhone: '+8801711111111',
              availableTimeSlots: [
                { day: 'MONDAY', startTime: '09:00', endTime: '12:00' },
              ],
            },
            update: {
              about: 'Senior cardiologist',
              clinicName: 'Heart Care Clinic',
              clinicAddress: 'Dhaka',
              clinicPhone: '+8801711111111',
              availableTimeSlots: [
                { day: 'MONDAY', startTime: '09:00', endTime: '12:00' },
              ],
            },
          },
        },
      },
    });
  });

  it('getProfileForAdmin returns the same doctor payload', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'd1',
      fullName: 'Dr. Admin View',
      email: 'admin-view@medflow.local',
      role: Role.DOCTOR,
      phone: '+8801700000001',
      address: 'Dhaka',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      professionalProfile: { specialization: 'Neurology' },
    });

    const result = await service.getProfileForAdmin('d1');
    expect(result.doctor.profile.specialization).toBe('Neurology');
  });
});
