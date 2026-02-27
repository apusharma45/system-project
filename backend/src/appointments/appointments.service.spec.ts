import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
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
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: prismaMock },
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
