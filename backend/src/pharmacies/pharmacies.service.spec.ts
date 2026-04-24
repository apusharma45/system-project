import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PharmaciesService } from './pharmacies.service';

describe('PharmaciesService', () => {
  let service: PharmaciesService;
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
        PharmaciesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PharmaciesService>(PharmaciesService);
  });

  it('getMyProfile returns pharmacy profile payload', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'ph-1',
      fullName: 'Prime Pharmacy',
      email: 'pharmacy@medflow.local',
      role: Role.PHARMACY,
      phone: '+8801700000004',
      address: 'Dhaka',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      professionalProfile: { pharmacyName: 'Prime Pharmacy', licenseNumber: 'PH-1001' },
    });

    const result = await service.getMyProfile('ph-1');
    expect(result.pharmacy.id).toBe('ph-1');
    expect(result.pharmacy.profile.pharmacyName).toBe('Prime Pharmacy');
  });

  it('getMyProfile throws when user is not pharmacy', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'ph-1',
      role: Role.PATIENT,
    });
    await expect(service.getMyProfile('ph-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateMyProfile updates only editable fields', async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: 'ph-1', role: Role.PHARMACY })
      .mockResolvedValueOnce({
        id: 'ph-1',
        fullName: 'Prime Pharmacy Updated',
        email: 'pharmacy@medflow.local',
        role: Role.PHARMACY,
        phone: '+8801700000099',
        address: 'Updated Address',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        professionalProfile: { pharmacyName: 'Prime Pharmacy', licenseNumber: 'PH-1001' },
      });

    await service.updateMyProfile('ph-1', {
      fullName: 'Prime Pharmacy Updated',
      phone: '+8801700000099',
      address: 'Updated Address',
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'ph-1' },
      data: {
        fullName: 'Prime Pharmacy Updated',
        phone: '+8801700000099',
        address: 'Updated Address',
      },
    });
  });

  it('updateProfileForAdmin can update pharmacy profile fields', async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: 'ph-1', role: Role.PHARMACY })
      .mockResolvedValueOnce({
        id: 'ph-1',
        fullName: 'Prime Pharmacy Updated',
        email: 'pharmacy@medflow.local',
        role: Role.PHARMACY,
        phone: '+8801700000099',
        address: 'Updated Address',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        professionalProfile: { pharmacyName: 'Prime Pharmacy+', licenseNumber: 'PH-2001' },
      });

    await service.updateProfileForAdmin('ph-1', {
      fullName: 'Prime Pharmacy Updated',
      phone: '+8801700000099',
      address: 'Updated Address',
      pharmacyName: 'Prime Pharmacy+',
      licenseNumber: 'PH-2001',
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'ph-1' },
      data: {
        fullName: 'Prime Pharmacy Updated',
        phone: '+8801700000099',
        address: 'Updated Address',
        professionalProfile: {
          upsert: {
            create: {
              pharmacyName: 'Prime Pharmacy+',
              licenseNumber: 'PH-2001',
            },
            update: {
              pharmacyName: 'Prime Pharmacy+',
              licenseNumber: 'PH-2001',
            },
          },
        },
      },
    });
  });
});
