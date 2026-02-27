import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
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
    return this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.CONFIRMED,
    );
  }

  async callByDoctor(doctorId: string, appointmentId: string) {
    return this.updateByDoctorTransition(doctorId, appointmentId, AppointmentStatus.CALLED);
  }

  async markInVisitByDoctor(doctorId: string, appointmentId: string) {
    return this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.IN_VISIT,
    );
  }

  async markExamDoneByDoctor(doctorId: string, appointmentId: string) {
    return this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.EXAM_DONE,
    );
  }

  async closeByDoctor(doctorId: string, appointmentId: string) {
    return this.updateByDoctorTransition(doctorId, appointmentId, AppointmentStatus.CLOSED);
  }

  async cancelByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.getAppointmentOrThrow(appointmentId);
    this.assertDoctorOwnership(appointment.doctorId, doctorId);

    const doctorCancellable: AppointmentStatus[] = [
      AppointmentStatus.REQUESTED,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.CALLED,
      AppointmentStatus.IN_VISIT,
    ];
    if (!doctorCancellable.includes(appointment.status)) {
      throw new BadRequestException(
        'Doctor can cancel only REQUESTED, CONFIRMED, CALLED, or IN_VISIT appointments',
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  async cancelByPatient(patientId: string, appointmentId: string) {
    const appointment = await this.getAppointmentOrThrow(appointmentId);
    if (appointment.patientId !== patientId) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }

    const patientCancellable: AppointmentStatus[] = [
      AppointmentStatus.REQUESTED,
      AppointmentStatus.CONFIRMED,
    ];
    if (!patientCancellable.includes(appointment.status)) {
      throw new BadRequestException(
        'Patient can cancel only REQUESTED or CONFIRMED appointments',
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  private async updateByDoctorTransition(
    doctorId: string,
    appointmentId: string,
    nextStatus: AppointmentStatus,
  ) {
    const appointment = await this.getAppointmentOrThrow(appointmentId);
    this.assertDoctorOwnership(appointment.doctorId, doctorId);
    this.transitionOrThrow(appointment.status, nextStatus);
    await this.assertCloseAllowed(appointment, nextStatus);

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: nextStatus },
    });
  }

  private async getAppointmentOrThrow(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  private assertDoctorOwnership(doctorIdInAppointment: string, doctorId: string) {
    if (doctorIdInAppointment !== doctorId) {
      throw new ForbiddenException('You can only modify your own appointments');
    }
  }

  private transitionOrThrow(current: AppointmentStatus, next: AppointmentStatus) {
    if (!TRANSITIONS[current].includes(next)) {
      throw new BadRequestException(`Invalid transition: ${current} -> ${next}`);
    }
  }

  private async assertCloseAllowed(
    appointment: { id: string; status: AppointmentStatus } & Record<string, unknown>,
    nextStatus: AppointmentStatus,
  ) {
    if (nextStatus !== AppointmentStatus.CLOSED) {
      return;
    }

    const requiresLab = Boolean((appointment as any).requiresLab);
    const labFlowLocked = Boolean((appointment as any).labFlowLocked);
    if (!requiresLab) {
      return;
    }
    if (labFlowLocked) {
      throw new BadRequestException(
        'Cannot close appointment while lab workflow is pending result upload',
      );
    }

    const db = this.prisma as any;
    const result = await db.labResult.findFirst({
      where: {
        labOrder: {
          appointmentId: appointment.id,
        },
      },
    });
    if (!result) {
      throw new BadRequestException('Cannot close appointment before lab result is uploaded');
    }
  }
}
