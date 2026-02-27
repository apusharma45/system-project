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
});
