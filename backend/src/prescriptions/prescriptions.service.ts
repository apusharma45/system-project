import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, PrescriptionStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionNotesDto } from './dto/update-prescription-notes.dto';

const TRANSITIONS: Record<PrescriptionStatus, PrescriptionStatus[]> = {
  DRAFT: [PrescriptionStatus.SIGNED],
  SIGNED: [PrescriptionStatus.SENT_TO_PATIENT],
  SENT_TO_PATIENT: [PrescriptionStatus.SENT_TO_PHARMACY],
  SENT_TO_PHARMACY: [PrescriptionStatus.DISPENSED],
  DISPENSED: [],
};

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(doctorId: string, dto: CreatePrescriptionDto) {
    const db = this.prisma as any;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException('You can only create prescriptions for your own appointments');
    }
    if (
      appointment.status !== AppointmentStatus.EXAM_DONE &&
      appointment.status !== AppointmentStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Prescription can be created only when appointment is EXAM_DONE or CLOSED',
      );
    }

    const pharmacy = await this.prisma.user.findUnique({
      where: { id: dto.pharmacyId },
      select: { id: true, role: true },
    });
    if (!pharmacy || pharmacy.role !== Role.PHARMACY) {
      throw new BadRequestException('pharmacyId must belong to a pharmacy user');
    }

    const existing = await db.prescription.findUnique({
      where: { appointmentId: dto.appointmentId },
    });
    if (existing) {
      throw new BadRequestException('Prescription already exists for this appointment');
    }

    return db.prescription.create({
      data: {
        appointmentId: dto.appointmentId,
        doctorId,
        pharmacyId: dto.pharmacyId,
        notes: dto.notes,
      },
    });
  }

  async signByDoctor(doctorId: string, prescriptionId: string, dto?: UpdatePrescriptionNotesDto) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);
    this.transitionOrThrow(prescription.status, PrescriptionStatus.SIGNED);
    await this.assertLabDependencySatisfied(prescription.appointment);

    return db.prescription.update({
      where: { id: prescriptionId },
      data: {
        status: PrescriptionStatus.SIGNED,
        ...(dto?.notes ? { notes: dto.notes } : {}),
      },
    });
  }

  async sendToPatientByDoctor(doctorId: string, prescriptionId: string) {
    return this.updateByDoctorTransition(
      doctorId,
      prescriptionId,
      PrescriptionStatus.SENT_TO_PATIENT,
    );
  }

  async sendToPharmacyByDoctor(doctorId: string, prescriptionId: string) {
    return this.updateByDoctorTransition(
      doctorId,
      prescriptionId,
      PrescriptionStatus.SENT_TO_PHARMACY,
    );
  }

  async dispenseByPharmacy(pharmacyId: string, prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    if (prescription.pharmacyId !== pharmacyId) {
      throw new ForbiddenException(
        'You can only dispense prescriptions assigned to your pharmacy',
      );
    }
    this.transitionOrThrow(prescription.status, PrescriptionStatus.DISPENSED);

    return db.prescription.update({
      where: { id: prescriptionId },
      data: { status: PrescriptionStatus.DISPENSED },
    });
  }

  listMine(userId: string, role: Role) {
    const db = this.prisma as any;
    if (role === Role.DOCTOR) {
      return db.prescription.findMany({
        where: { doctorId: userId },
        include: { appointment: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (role === Role.PHARMACY) {
      return db.prescription.findMany({
        where: { pharmacyId: userId },
        include: { appointment: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (role === Role.PATIENT) {
      return db.prescription.findMany({
        where: {
          appointment: { patientId: userId },
        },
        include: { appointment: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    throw new ForbiddenException('Role cannot view prescriptions');
  }

  async getOne(userId: string, role: Role, prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await db.prescription.findUnique({
      where: { id: prescriptionId },
      include: { appointment: true },
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (role === Role.DOCTOR && prescription.doctorId === userId) {
      return prescription;
    }
    if (role === Role.PHARMACY && prescription.pharmacyId === userId) {
      return prescription;
    }
    if (role === Role.PATIENT && prescription.appointment.patientId === userId) {
      return prescription;
    }

    throw new ForbiddenException('You are not allowed to access this prescription');
  }

  private async updateByDoctorTransition(
    doctorId: string,
    prescriptionId: string,
    nextStatus: PrescriptionStatus,
  ) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);
    this.transitionOrThrow(prescription.status, nextStatus);

    return db.prescription.update({
      where: { id: prescriptionId },
      data: { status: nextStatus },
    });
  }

  private async getPrescriptionWithAppointmentOrThrow(prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await db.prescription.findUnique({
      where: { id: prescriptionId },
      include: { appointment: true },
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    return prescription;
  }

  private assertDoctorOwnership(doctorIdInPrescription: string, doctorId: string) {
    if (doctorIdInPrescription !== doctorId) {
      throw new ForbiddenException('You can only modify your own prescriptions');
    }
  }

  private transitionOrThrow(current: PrescriptionStatus, next: PrescriptionStatus) {
    if (!TRANSITIONS[current].includes(next)) {
      throw new BadRequestException(`Invalid transition: ${current} -> ${next}`);
    }
  }

  private async assertLabDependencySatisfied(
    appointment: { id: string; requiresLab?: boolean; labFlowLocked?: boolean },
  ) {
    if (!appointment.requiresLab) {
      return;
    }
    if (appointment.labFlowLocked) {
      throw new BadRequestException('Cannot sign prescription while lab workflow is pending');
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
      throw new BadRequestException('Cannot sign prescription before lab result is uploaded');
    }
  }
}
