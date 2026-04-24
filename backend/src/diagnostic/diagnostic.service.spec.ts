import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DiagnosticService } from './diagnostic.service';

describe('DiagnosticService', () => {
  let service: DiagnosticService;
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
        DiagnosticService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DiagnosticService>(DiagnosticService);
  });

  it('getMyProfile returns diagnostic profile payload', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag-1',
      fullName: 'Prime Lab',
      email: 'lab@medflow.local',
      role: Role.DIAGNOSTIC,
      phone: '+8801700000003',
      address: 'Dhaka',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      professionalProfile: { labName: 'Prime Lab', licenseNumber: 'LAB-1001' },
    });

    const result = await service.getMyProfile('diag-1');
    expect(result.diagnostic.id).toBe('diag-1');
    expect(result.diagnostic.profile.labName).toBe('Prime Lab');
  });

  it('getMyProfile throws when user is not diagnostic', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag-1',
      role: Role.DOCTOR,
    });
    await expect(service.getMyProfile('diag-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateMyProfile updates only editable fields', async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: 'diag-1', role: Role.DIAGNOSTIC })
      .mockResolvedValueOnce({
        id: 'diag-1',
        fullName: 'Prime Lab Updated',
        email: 'lab@medflow.local',
        role: Role.DIAGNOSTIC,
        phone: '+8801700000099',
        address: 'Updated Address',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        professionalProfile: { labName: 'Prime Lab', licenseNumber: 'LAB-1001' },
      });

    await service.updateMyProfile('diag-1', {
      fullName: 'Prime Lab Updated',
      phone: '+8801700000099',
      address: 'Updated Address',
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'diag-1' },
      data: {
        fullName: 'Prime Lab Updated',
        phone: '+8801700000099',
        address: 'Updated Address',
      },
    });
  });

  it('updateProfileForAdmin can update diagnostic profile fields', async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: 'diag-1', role: Role.DIAGNOSTIC })
      .mockResolvedValueOnce({
        id: 'diag-1',
        fullName: 'Prime Lab Updated',
        email: 'lab@medflow.local',
        role: Role.DIAGNOSTIC,
        phone: '+8801700000099',
        address: 'Updated Address',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        professionalProfile: { licenseNumber: 'LAB-2001', specialization: 'Pathology' },
      });

    await service.updateProfileForAdmin('diag-1', {
      fullName: 'Prime Lab Updated',
      phone: '+8801700000099',
      address: 'Updated Address',
      licenseNumber: 'LAB-2001',
      specialization: 'Pathology',
      gender: 'MALE',
      dateOfBirth: '1995-03-01',
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'diag-1' },
      data: {
        fullName: 'Prime Lab Updated',
        phone: '+8801700000099',
        address: 'Updated Address',
        professionalProfile: {
          upsert: {
            create: {
              licenseNumber: 'LAB-2001',
              specialization: 'Pathology',
              gender: 'MALE',
              dateOfBirth: new Date('1995-03-01'),
            },
            update: {
              licenseNumber: 'LAB-2001',
              specialization: 'Pathology',
              gender: 'MALE',
              dateOfBirth: new Date('1995-03-01'),
            },
          },
        },
      },
    });
  });
});
