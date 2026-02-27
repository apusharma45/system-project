import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  REQUESTED: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
  CONFIRMED: [
    AppointmentStatus.CALLED,
    AppointmentStatus.IN_VISIT,
    AppointmentStatus.CANCELLED,
  ],
  CALLED: [AppointmentStatus.IN_VISIT, AppointmentStatus.CANCELLED],
  IN_VISIT: [AppointmentStatus.EXAM_DONE, AppointmentStatus.CANCELLED],
  EXAM_DONE: [AppointmentStatus.CLOSED],
  CLOSED: [],
  CANCELLED: [],
};

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForPatient(patientId: string, dto: CreateAppointmentDto) {
    if (patientId === dto.doctorId) {
      throw new BadRequestException('Patient and doctor cannot be the same user');
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: dto.doctorId },
      select: { id: true, role: true },
    });

    if (!doctor || doctor.role !== Role.DOCTOR) {
      throw new BadRequestException('doctorId must belong to a doctor');
    }

    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: dto.doctorId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  listMyAppointments(userId: string, role: Role) {
    if (role === Role.PATIENT) {
      return this.prisma.appointment.findMany({
        where: { patientId: userId },
        orderBy: { scheduledAt: 'asc' },
      });
    }

    if (role === Role.DOCTOR) {
      return this.prisma.appointment.findMany({
        where: { doctorId: userId },
        orderBy: { scheduledAt: 'asc' },
      });
    }

    throw new ForbiddenException('Only patients and doctors can view appointments');
  }

  async confirm(doctorId: string, appointmentId: string) {
    return this.updateByDoctor(doctorId, appointmentId, AppointmentStatus.CONFIRMED);
  }

  async call(doctorId: string, appointmentId: string) {
    return this.updateByDoctor(doctorId, appointmentId, AppointmentStatus.CALLED);
  }

  async markInVisit(doctorId: string, appointmentId: string) {
    return this.updateByDoctor(doctorId, appointmentId, AppointmentStatus.IN_VISIT);
  }

  async markExamDone(doctorId: string, appointmentId: string) {
    return this.updateByDoctor(doctorId, appointmentId, AppointmentStatus.EXAM_DONE);
  }

  async close(doctorId: string, appointmentId: string) {
    return this.updateByDoctor(doctorId, appointmentId, AppointmentStatus.CLOSED);
  }

  async cancelByDoctor(doctorId: string, appointmentId: string) {
    return this.updateByDoctor(doctorId, appointmentId, AppointmentStatus.CANCELLED);
  }

  async cancelByPatient(patientId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.patientId !== patientId) {
      throw new ForbiddenException('You can cancel only your own appointments');
    }

    const cancellableByPatient: AppointmentStatus[] = [
      AppointmentStatus.REQUESTED,
      AppointmentStatus.CONFIRMED,
    ];

    if (!cancellableByPatient.includes(appointment.status)) {
      throw new BadRequestException(
        'Patient can cancel only REQUESTED or CONFIRMED appointments',
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  private async updateByDoctor(
    doctorId: string,
    appointmentId: string,
    nextStatus: AppointmentStatus,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException('You can only modify your own appointments');
    }

    const allowed = ALLOWED_TRANSITIONS[appointment.status];
    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid transition: ${appointment.status} -> ${nextStatus}`,
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: nextStatus },
    });
  }
}
