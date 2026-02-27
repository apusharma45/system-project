import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LabsService } from './labs.service';

describe('LabsService', () => {
  let service: LabsService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    labOrder: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    labResult: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<LabsService>(LabsService);
  });

  it('createOrder creates a lab order and locks appointment lab flow', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.IN_VISIT,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag1',
      role: Role.DIAGNOSTIC,
    });
    prismaMock.labOrder.findUnique.mockResolvedValueOnce(null);
    prismaMock.labOrder.create.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    const result = await service.createOrder('d1', {
      appointmentId: 'a1',
      diagnosticId: 'diag1',
    });

    expect(prismaMock.appointment.update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: { requiresLab: true, labFlowLocked: true },
    });
    expect(result.status).toBe('CREATED');
  });

  it('createOrder rejects non-owned appointment', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'other',
      status: AppointmentStatus.IN_VISIT,
    });

    await expect(
      service.createOrder('d1', { appointmentId: 'a1', diagnosticId: 'diag1' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('createOrder rejects invalid appointment status', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.CONFIRMED,
    });

    await expect(
      service.createOrder('d1', { appointmentId: 'a1', diagnosticId: 'diag1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('createOrder rejects non-diagnostic target user', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag1',
      role: Role.PATIENT,
    });

    await expect(
      service.createOrder('d1', { appointmentId: 'a1', diagnosticId: 'diag1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('createOrder rejects duplicate lab order for appointment', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag1',
      role: Role.DIAGNOSTIC,
    });
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'existing',
      appointmentId: 'a1',
    });

    await expect(
      service.createOrder('d1', { appointmentId: 'a1', diagnosticId: 'diag1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('assignOrder enforces CREATED -> ASSIGNED', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });
    prismaMock.labOrder.update.mockResolvedValueOnce({
      id: 'o1',
      diagnosticId: 'diag1',
      status: 'ASSIGNED',
    });

    const result = await service.assignOrder('diag1', 'o1');
    expect(result.status).toBe('ASSIGNED');
  });

  it('collectSample rejects invalid transition CREATED -> SAMPLE_COLLECTED', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    await expect(service.collectSample('diag1', 'o1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('uploadResult stores result and unlocks appointment flow', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'SAMPLE_COLLECTED',
    });
    prismaMock.labResult.findUnique.mockResolvedValueOnce(null);
    prismaMock.labOrder.update.mockResolvedValueOnce({
      id: 'o1',
      status: 'RESULT_UPLOADED',
    });
    prismaMock.labResult.create.mockResolvedValueOnce({
      id: 'r1',
      labOrderId: 'o1',
      fileUrl: 'https://file.test/result.pdf',
    });

    const result = await service.uploadResult('diag1', 'o1', {
      fileUrl: 'https://file.test/result.pdf',
    });

    expect(prismaMock.appointment.update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: { labFlowLocked: false },
    });
    expect(result.labOrderId).toBe('o1');
  });

  it('uploadResult rejects duplicate result upload', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'SAMPLE_COLLECTED',
    });
    prismaMock.labResult.findUnique.mockResolvedValueOnce({
      id: 'r1',
      labOrderId: 'o1',
    });

    await expect(
      service.uploadResult('diag1', 'o1', { fileUrl: 'https://file.test/result.pdf' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('markSent enforces RESULT_UPLOADED -> SENT', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      diagnosticId: 'diag1',
      status: 'RESULT_UPLOADED',
    });
    prismaMock.labOrder.update.mockResolvedValueOnce({
      id: 'o1',
      status: 'SENT',
    });

    const result = await service.markSent('diag1', 'o1');
    expect(result.status).toBe('SENT');
  });

  it('rejects modifying lab order by different diagnostic user', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    await expect(service.assignOrder('diag2', 'o1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('listMine filters by role and rejects unsupported roles', async () => {
    prismaMock.labOrder.findMany.mockResolvedValue([]);
    await service.listMine('u1', Role.DOCTOR);
    await service.listMine('u1', Role.PATIENT);
    await service.listMine('u1', Role.DIAGNOSTIC);

    expect(() => service.listMine('u1', Role.ADMIN)).toThrow(ForbiddenException);
    expect(prismaMock.labOrder.findMany).toHaveBeenCalledTimes(3);
  });

  it('getResult enforces role-based access', async () => {
    prismaMock.labOrder.findUnique
      .mockResolvedValueOnce({
        id: 'o1',
        diagnosticId: 'diag1',
        appointment: { doctorId: 'doc1', patientId: 'pat1' },
        labResult: { id: 'r1', labOrderId: 'o1' },
      })
      .mockResolvedValueOnce({
        id: 'o1',
        diagnosticId: 'diag1',
        appointment: { doctorId: 'doc1', patientId: 'pat1' },
        labResult: { id: 'r1', labOrderId: 'o1' },
      });

    const allowed = await service.getResult('doc1', Role.DOCTOR, 'o1');
    expect(allowed.id).toBe('r1');

    await expect(service.getResult('other', Role.DOCTOR, 'o1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws not found when order or result is missing', async () => {
    prismaMock.labOrder.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'o1',
        diagnosticId: 'diag1',
        appointment: { doctorId: 'doc1', patientId: 'pat1' },
        labResult: null,
      });

    await expect(service.getResult('doc1', Role.DOCTOR, 'o1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.getResult('doc1', Role.DOCTOR, 'o1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
