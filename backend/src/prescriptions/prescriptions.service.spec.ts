import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus, PrescriptionStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrescriptionsService } from './prescriptions.service';

describe('PrescriptionsService', () => {
  let service: PrescriptionsService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
    },
    prescription: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    labResult: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PrescriptionsService>(PrescriptionsService);
  });

  it('createDraft creates a draft for valid doctor appointment and pharmacy', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'p1',
      role: Role.PHARMACY,
    });
    prismaMock.prescription.findUnique.mockResolvedValueOnce(null);
    prismaMock.prescription.create.mockResolvedValueOnce({
      id: 'rx1',
      appointmentId: 'a1',
      doctorId: 'd1',
      pharmacyId: 'p1',
      notes: 'Take once daily',
      status: PrescriptionStatus.DRAFT,
    });

    const result = await service.createDraft('d1', {
      appointmentId: 'a1',
      pharmacyId: 'p1',
      notes: 'Take once daily',
    });
    expect(result.status).toBe(PrescriptionStatus.DRAFT);
  });

  it('createDraft rejects invalid ownership/state/pharmacy/duplicate', async () => {
    prismaMock.appointment.findUnique
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'other',
        status: AppointmentStatus.EXAM_DONE,
      })
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'd1',
        status: AppointmentStatus.IN_VISIT,
      })
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'd1',
        status: AppointmentStatus.CLOSED,
      })
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'd1',
        status: AppointmentStatus.CLOSED,
      });
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: 'p1',
        role: Role.PATIENT,
      })
      .mockResolvedValueOnce({
        id: 'p1',
        role: Role.PHARMACY,
      });
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'existing',
    });

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('signByDoctor allows no-lab appointments', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx1',
      doctorId: 'd1',
      status: PrescriptionStatus.DRAFT,
      appointment: { id: 'a1', requiresLab: false, labFlowLocked: false },
    });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      status: PrescriptionStatus.SIGNED,
      notes: 'updated',
    });

    const result = await service.signByDoctor('d1', 'rx1', { notes: 'updated' });
    expect(result.status).toBe(PrescriptionStatus.SIGNED);
  });

  it('signByDoctor enforces conditional lab dependency and transition validity', async () => {
    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.DRAFT,
        appointment: { id: 'a1', requiresLab: true, labFlowLocked: true },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.DRAFT,
        appointment: { id: 'a1', requiresLab: true, labFlowLocked: false },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.SIGNED,
        appointment: { id: 'a1', requiresLab: false, labFlowLocked: false },
      });
    prismaMock.labResult.findFirst.mockResolvedValueOnce(null);

    await expect(service.signByDoctor('d1', 'rx1')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.signByDoctor('d1', 'rx1')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.signByDoctor('d1', 'rx1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('signByDoctor allows required-lab appointment when result exists', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx1',
      doctorId: 'd1',
      status: PrescriptionStatus.DRAFT,
      appointment: { id: 'a1', requiresLab: true, labFlowLocked: false },
    });
    prismaMock.labResult.findFirst.mockResolvedValueOnce({ id: 'r1' });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      status: PrescriptionStatus.SIGNED,
    });

    const result = await service.signByDoctor('d1', 'rx1');
    expect(result.status).toBe(PrescriptionStatus.SIGNED);
  });

  it('doctor transitions follow SIGNED -> SENT_TO_PATIENT -> SENT_TO_PHARMACY', async () => {
    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.SIGNED,
        appointment: { id: 'a1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.SENT_TO_PATIENT,
        appointment: { id: 'a1' },
      });
    prismaMock.prescription.update
      .mockResolvedValueOnce({
        id: 'rx1',
        status: PrescriptionStatus.SENT_TO_PATIENT,
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
      });

    const one = await service.sendToPatientByDoctor('d1', 'rx1');
    const two = await service.sendToPharmacyByDoctor('d1', 'rx1');
    expect(one.status).toBe(PrescriptionStatus.SENT_TO_PATIENT);
    expect(two.status).toBe(PrescriptionStatus.SENT_TO_PHARMACY);
  });

  it('dispenseByPharmacy allows assigned pharmacy and rejects others/invalid state', async () => {
    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
        appointment: { id: 'a1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PATIENT,
        appointment: { id: 'a1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
        appointment: { id: 'a1' },
      });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      status: PrescriptionStatus.DISPENSED,
    });

    const ok = await service.dispenseByPharmacy('ph1', 'rx1');
    expect(ok.status).toBe(PrescriptionStatus.DISPENSED);

    await expect(service.dispenseByPharmacy('ph1', 'rx1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.dispenseByPharmacy('ph2', 'rx1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('listMine queries by role and getOne enforces access', async () => {
    prismaMock.prescription.findMany.mockResolvedValue([]);
    await service.listMine('d1', Role.DOCTOR);
    await service.listMine('p1', Role.PHARMACY);
    await service.listMine('u1', Role.PATIENT);
    expect(prismaMock.prescription.findMany).toHaveBeenCalledTimes(3);
    expect(() => service.listMine('u1', Role.ADMIN)).toThrow(ForbiddenException);

    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        appointment: { patientId: 'pt1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        appointment: { patientId: 'pt1' },
      })
      .mockResolvedValueOnce(null);

    const allowed = await service.getOne('d1', Role.DOCTOR, 'rx1');
    expect(allowed.id).toBe('rx1');
    await expect(service.getOne('other', Role.DOCTOR, 'rx1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    await expect(service.getOne('d1', Role.DOCTOR, 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
