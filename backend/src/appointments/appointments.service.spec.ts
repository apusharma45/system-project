import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  const baseAppointment = {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    status: AppointmentStatus.REQUESTED,
  };
  const notificationsMock = {
    createAndEmit: jest.fn(),
  };
  const auditMock = {
    record: jest.fn(),
  };
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    labOrder: {
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMock.labOrder.count.mockResolvedValue(0);
    prismaMock.labOrder.findFirst.mockResolvedValue(null);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsService, useValue: notificationsMock },
        { provide: AuditService, useValue: auditMock },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('createForPatient rejects non-doctor user', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'u1', role: Role.PATIENT });

    await expect(
      service.createForPatient('p1', {
        doctorId: 'u1',
        scheduledAt: new Date().toISOString(),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('createForPatient allows empty preferred window and reason', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'd1', role: Role.DOCTOR });
    prismaMock.appointment.create.mockResolvedValueOnce({
      ...baseAppointment,
      preferredDateFrom: null,
      preferredDateTo: null,
      preferredTimeNote: null,
      reason: null,
    });

    const result = await service.createForPatient('p1', {
      doctorId: 'd1',
    });

    expect(prismaMock.appointment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        doctorId: 'd1',
        patientId: 'p1',
        preferredDateFrom: null,
        preferredDateTo: null,
        preferredTimeNote: null,
        reason: null,
      }),
    });
    expect(result.id).toBe('a1');
  });

  it('createForPatient rejects preferred time note without reason', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'd1', role: Role.DOCTOR });

    await expect(
      service.createForPatient('p1', {
        doctorId: 'd1',
        preferredTimeNote: 'Evening',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('createForPatient validates preferred window order when both dates are provided', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'd1', role: Role.DOCTOR });

    await expect(
      service.createForPatient('p1', {
        doctorId: 'd1',
        preferredDateFrom: '2026-03-08T10:00:00.000Z',
        preferredDateTo: '2026-03-08T09:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('confirmByDoctor throws NotFoundException for unknown appointment', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce(null);
    await expect(service.confirmByDoctor('d1', 'a1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('confirmByDoctor rejects different doctor', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd2',
      status: AppointmentStatus.REQUESTED,
    });
    await expect(service.confirmByDoctor('d1', 'a1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('confirmByDoctor updates REQUESTED to CONFIRMED', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.REQUESTED,
    });
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CONFIRMED,
    });

    const result = await service.confirmByDoctor('d1', 'a1');
    expect(prismaMock.appointment.update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: { status: AppointmentStatus.CONFIRMED },
    });
    expect(result.status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('scheduleByDoctor updates REQUESTED to CONFIRMED and assigns scheduledAt', async () => {
    const scheduledAt = '2026-03-10T09:30:00.000Z';
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.REQUESTED,
    });
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CONFIRMED,
      scheduledAt: new Date(scheduledAt),
    });

    const result = await service.scheduleByDoctor('d1', 'a1', scheduledAt);

    expect(prismaMock.appointment.update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: {
        scheduledAt: new Date(scheduledAt),
        status: AppointmentStatus.CONFIRMED,
      },
    });
    expect(notificationsMock.createAndEmit).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('scheduleByDoctor rejects non-requested appointments', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CONFIRMED,
    });

    await expect(service.scheduleByDoctor('d1', 'a1', new Date().toISOString())).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(notificationsMock.createAndEmit).not.toHaveBeenCalled();
  });

  it('callByDoctor updates CONFIRMED to CALLED', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CONFIRMED,
    });
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CALLED,
    });

    const result = await service.callByDoctor('d1', 'a1');
    expect(result.status).toBe(AppointmentStatus.CALLED);
    expect(notificationsMock.createAndEmit).toHaveBeenCalledTimes(1);
    expect(auditMock.record).toHaveBeenCalled();
  });

  it('callByDoctor does not notify on invalid transition', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.REQUESTED,
    });

    await expect(service.callByDoctor('d1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
    expect(notificationsMock.createAndEmit).not.toHaveBeenCalled();
    expect(auditMock.record).not.toHaveBeenCalled();
  });

  it('markInVisitByDoctor updates CALLED to IN_VISIT', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CALLED,
    });
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.IN_VISIT,
    });

    const result = await service.markInVisitByDoctor('d1', 'a1');
    expect(result.status).toBe(AppointmentStatus.IN_VISIT);
  });

  it('markExamDoneByDoctor updates IN_VISIT to EXAM_DONE', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.IN_VISIT,
    });
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
    });

    const result = await service.markExamDoneByDoctor('d1', 'a1');
    expect(result.status).toBe(AppointmentStatus.EXAM_DONE);
  });

  it('closeByDoctor updates EXAM_DONE to CLOSED', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CLOSED,
    });

    const result = await service.closeByDoctor('d1', 'a1');
    expect(result.status).toBe(AppointmentStatus.CLOSED);
  });

  it('closeByDoctor rejects closing when lab is required and locked', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
      requiresLab: true,
      labFlowLocked: true,
    });

    await expect(service.closeByDoctor('d1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('closeByDoctor rejects closing when lab required but no order exists', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
      requiresLab: true,
      labFlowLocked: false,
    });
    prismaMock.labOrder.count.mockResolvedValueOnce(0);

    await expect(service.closeByDoctor('d1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('closeByDoctor rejects closing when any lab order is pending result', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
      requiresLab: true,
      labFlowLocked: false,
    });
    prismaMock.labOrder.count.mockResolvedValueOnce(2);
    prismaMock.labOrder.findFirst.mockResolvedValueOnce({ id: 'pending-order' });

    await expect(service.closeByDoctor('d1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('closeByDoctor allows closing when all lab orders have results', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
      requiresLab: true,
      labFlowLocked: false,
    });
    prismaMock.labOrder.count.mockResolvedValueOnce(2);
    prismaMock.labOrder.findFirst.mockResolvedValueOnce(null);
    prismaMock.appointment.update.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CLOSED,
      requiresLab: true,
      labFlowLocked: false,
    });

    const result = await service.closeByDoctor('d1', 'a1');
    expect(result.status).toBe(AppointmentStatus.CLOSED);
  });

  it('rejects invalid transition REQUESTED -> EXAM_DONE', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.REQUESTED,
    });
    await expect(service.markExamDoneByDoctor('d1', 'a1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('rejects transition from terminal CLOSED', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CLOSED,
    });
    await expect(service.callByDoctor('d1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects transition from terminal CANCELLED', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.CANCELLED,
    });
    await expect(service.markInVisitByDoctor('d1', 'a1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('cancelByPatient allows REQUESTED/CONFIRMED', async () => {
    prismaMock.appointment.findUnique
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.REQUESTED,
      })
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.CONFIRMED,
      });
    prismaMock.appointment.update
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.CANCELLED,
      })
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.CANCELLED,
      });

    const one = await service.cancelByPatient('p1', 'a1');
    const two = await service.cancelByPatient('p1', 'a1');
    expect(one.status).toBe(AppointmentStatus.CANCELLED);
    expect(two.status).toBe(AppointmentStatus.CANCELLED);
  });

  it('cancelByPatient rejects IN_VISIT', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.IN_VISIT,
    });

    await expect(service.cancelByPatient('p1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cancelByPatient rejects wrong owner', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      patientId: 'another',
      status: AppointmentStatus.REQUESTED,
    });
    await expect(service.cancelByPatient('p1', 'a1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('cancelByDoctor allows CALLED/IN_VISIT', async () => {
    prismaMock.appointment.findUnique
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.CALLED,
      })
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.IN_VISIT,
      });
    prismaMock.appointment.update
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.CANCELLED,
      })
      .mockResolvedValueOnce({
        ...baseAppointment,
        status: AppointmentStatus.CANCELLED,
      });

    const one = await service.cancelByDoctor('d1', 'a1');
    const two = await service.cancelByDoctor('d1', 'a1');
    expect(one.status).toBe(AppointmentStatus.CANCELLED);
    expect(two.status).toBe(AppointmentStatus.CANCELLED);
  });

  it('cancelByDoctor rejects EXAM_DONE', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      status: AppointmentStatus.EXAM_DONE,
    });
    await expect(service.cancelByDoctor('d1', 'a1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cancelByDoctor rejects different doctor', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      ...baseAppointment,
      doctorId: 'd2',
      status: AppointmentStatus.CONFIRMED,
    });
    await expect(service.cancelByDoctor('d1', 'a1')).rejects.toBeInstanceOf(ForbiddenException);
  });
});
