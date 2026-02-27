import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForPatient(patientId: string, dto: CreateAppointmentDto) {
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

  listMine(userId: string, role: Role) {
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

    throw new ForbiddenException('Only doctor and patient roles can view appointments');
  }

  async confirmByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException('You can only confirm your own appointments');
    }
    if (appointment.status !== AppointmentStatus.REQUESTED) {
      throw new BadRequestException('Only REQUESTED appointments can be confirmed');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CONFIRMED },
    });
  }
}
