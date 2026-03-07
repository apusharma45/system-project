import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, NotificationType, Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {}

  async createForPatient(patientId: string, dto: CreateAppointmentDto) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: dto.doctorId },
      select: { id: true, role: true },
    });

    if (!doctor || doctor.role !== Role.DOCTOR) {
      throw new BadRequestException('doctorId must belong to a doctor');
    }

    if (!dto.scheduledAt) {
      const fromDate = new Date(dto.preferredDateFrom);
      const toDate = new Date(dto.preferredDateTo);
      if (toDate < fromDate) {
        throw new BadRequestException('preferredDateTo must be greater than or equal to preferredDateFrom');
      }
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: dto.doctorId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        reason: dto.reason ?? null,
        preferredDateFrom: dto.preferredDateFrom ? new Date(dto.preferredDateFrom) : null,
        preferredDateTo: dto.preferredDateTo ? new Date(dto.preferredDateTo) : null,
        preferredTimeNote: dto.preferredTimeNote ?? null,
      },
    });
    await this.auditService.record(patientId, 'APPOINTMENT_CREATED', 'Appointment', appointment.id, {
      doctorId: dto.doctorId,
      scheduledAt: dto.scheduledAt ?? null,
      preferredDateFrom: dto.preferredDateFrom ?? null,
      preferredDateTo: dto.preferredDateTo ?? null,
      preferredTimeNote: dto.preferredTimeNote ?? null,
      reason: dto.reason ?? null,
    });
    return appointment;
  }

  async listMine(userId: string, role: Role) {
    if (role === Role.PATIENT) {
      return this.prisma.appointment.findMany({
        where: { patientId: userId },
        orderBy: { scheduledAt: 'asc' },
      });
    }
    if (role === Role.DOCTOR) {
      const appointments = await this.prisma.appointment.findMany({
        where: { doctorId: userId },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              email: true,
              patientProfile: true,
            },
          },
        },
        orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
      });

      const patientIds = [...new Set(appointments.map((item) => item.patientId))];
      const historyByPatient = new Map<
        string,
        {
          appointmentCount: number;
          labOrderCount: number;
          prescriptionCount: number;
          latestAppointmentAt: Date | null;
          latestLabResultAt: Date | null;
          latestPrescriptionAt: Date | null;
        }
      >();

      await Promise.all(
        patientIds.map(async (patientId) => {
          const [appointmentCount, labOrderCount, prescriptionCount, latestAppointment, latestLab, latestPrescription] =
            await Promise.all([
              this.prisma.appointment.count({ where: { patientId } }),
              (this.prisma as any).labOrder.count({ where: { appointment: { patientId } } }),
              (this.prisma as any).prescription.count({ where: { appointment: { patientId } } }),
              this.prisma.appointment.findFirst({
                where: { patientId, scheduledAt: { not: null } },
                orderBy: { scheduledAt: 'desc' },
                select: { scheduledAt: true },
              }),
              (this.prisma as any).labResult.findFirst({
                where: { labOrder: { appointment: { patientId } } },
                orderBy: { uploadedAt: 'desc' },
                select: { uploadedAt: true },
              }),
              (this.prisma as any).prescription.findFirst({
                where: { appointment: { patientId } },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true },
              }),
            ]);

          historyByPatient.set(patientId, {
            appointmentCount,
            labOrderCount,
            prescriptionCount,
            latestAppointmentAt: latestAppointment?.scheduledAt ?? null,
            latestLabResultAt: latestLab?.uploadedAt ?? null,
            latestPrescriptionAt: latestPrescription?.createdAt ?? null,
          });
        }),
      );

      return appointments.map(({ patient, ...appointment }) => ({
        ...appointment,
        patientSnapshot: {
          id: patient.id,
          fullName: patient.fullName,
          email: patient.email,
          profile: patient.patientProfile,
        },
        patientHistorySummary: historyByPatient.get(appointment.patientId) ?? {
          appointmentCount: 0,
          labOrderCount: 0,
          prescriptionCount: 0,
          latestAppointmentAt: null,
          latestLabResultAt: null,
          latestPrescriptionAt: null,
        },
      }));
    }

    throw new ForbiddenException('Only doctor and patient roles can view appointments');
  }

  async confirmByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.CONFIRMED,
    );
    await this.auditService.record(
      doctorId,
      'APPOINTMENT_CONFIRMED',
      'Appointment',
      appointment.id,
    );
    return appointment;
  }

  async scheduleByDoctor(doctorId: string, appointmentId: string, scheduledAt: string) {
    const appointment = await this.getAppointmentOrThrow(appointmentId);
    this.assertDoctorOwnership(appointment.doctorId, doctorId);

    if (appointment.status !== AppointmentStatus.REQUESTED) {
      throw new BadRequestException('Only REQUESTED appointments can be scheduled');
    }

    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      throw new BadRequestException('scheduledAt must be a valid ISO date');
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        scheduledAt: scheduledDate,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    await this.notificationsService.createAndEmit(
      updated.patientId,
      NotificationType.APPOINTMENT_CALLED,
      `Your appointment has been scheduled for ${scheduledDate.toLocaleString()}.`,
      { appointmentId: updated.id, scheduledAt: updated.scheduledAt },
      doctorId,
    );
    await this.auditService.record(doctorId, 'APPOINTMENT_SCHEDULED', 'Appointment', updated.id, {
      scheduledAt: updated.scheduledAt,
    });

    return updated;
  }

  async callByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.CALLED,
    );
    await this.notificationsService.createAndEmit(
      appointment.patientId,
      NotificationType.APPOINTMENT_CALLED,
      'Your appointment has been called by the doctor.',
      { appointmentId: appointment.id },
      doctorId,
    );
    await this.auditService.record(doctorId, 'APPOINTMENT_CALLED', 'Appointment', appointment.id);
    return appointment;
  }

  async markInVisitByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.IN_VISIT,
    );
    await this.auditService.record(doctorId, 'APPOINTMENT_IN_VISIT', 'Appointment', appointment.id);
    return appointment;
  }

  async markExamDoneByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.EXAM_DONE,
    );
    await this.auditService.record(
      doctorId,
      'APPOINTMENT_EXAM_DONE',
      'Appointment',
      appointment.id,
    );
    return appointment;
  }

  async closeByDoctor(doctorId: string, appointmentId: string) {
    const appointment = await this.updateByDoctorTransition(
      doctorId,
      appointmentId,
      AppointmentStatus.CLOSED,
    );
    await this.auditService.record(doctorId, 'APPOINTMENT_CLOSED', 'Appointment', appointment.id);
    return appointment;
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

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
    await this.auditService.record(
      doctorId,
      'APPOINTMENT_CANCELLED_BY_DOCTOR',
      'Appointment',
      updatedAppointment.id,
    );
    return updatedAppointment;
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

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
    await this.auditService.record(
      patientId,
      'APPOINTMENT_CANCELLED_BY_PATIENT',
      'Appointment',
      updatedAppointment.id,
    );
    return updatedAppointment;
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
