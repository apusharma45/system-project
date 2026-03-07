import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;

  const prismaMock = {
    appointment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    labOrder: {
      findMany: jest.fn(),
    },
    prescription: {
      findMany: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('rejects doctor without patient relationship', async () => {
    prismaMock.appointment.findFirst.mockResolvedValueOnce(null);

    await expect(service.getProfileForDoctor('doctor-1', 'patient-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws not found for non-patient users', async () => {
    prismaMock.appointment.findFirst.mockResolvedValueOnce({ id: 'a1' });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'patient-1',
      email: 'x@test.com',
      role: Role.DOCTOR,
    });

    await expect(service.getProfileForDoctor('doctor-1', 'patient-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns profile summary and history arrays', async () => {
    prismaMock.appointment.findFirst.mockResolvedValueOnce({ id: 'a1' });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'patient-1',
      email: 'patient@test.com',
      role: Role.PATIENT,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      patientProfile: { gender: 'Female' },
    });
    prismaMock.appointment.findMany.mockResolvedValueOnce([{ id: 'a1' }]);
    prismaMock.labOrder.findMany.mockResolvedValueOnce([{ id: 'l1' }]);
    prismaMock.prescription.findMany.mockResolvedValueOnce([{ id: 'p1' }]);

    const result = await service.getProfileForDoctor('doctor-1', 'patient-1');

    expect(result.patient.id).toBe('patient-1');
    expect(result.summary).toEqual({
      appointmentCount: 1,
      labOrderCount: 1,
      prescriptionCount: 1,
    });
    expect(result.history.appointments).toHaveLength(1);
    expect(result.history.labOrders).toHaveLength(1);
    expect(result.history.prescriptions).toHaveLength(1);
  });
});
