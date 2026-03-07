import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AppointmentStatus,
  NotificationType,
  PrescriptionStatus,
  Role,
} from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionNotesDto } from './dto/update-prescription-notes.dto';

type UploadedPrescriptionFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

const TRANSITIONS: Record<PrescriptionStatus, PrescriptionStatus[]> = {
  DRAFT: [PrescriptionStatus.SIGNED],
  SIGNED: [PrescriptionStatus.SENT_TO_PATIENT],
  SENT_TO_PATIENT: [PrescriptionStatus.SENT_TO_PHARMACY],
  SENT_TO_PHARMACY: [PrescriptionStatus.DISPENSED],
  DISPENSED: [],
};

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

    const prescription = await db.prescription.create({
      data: {
        appointmentId: dto.appointmentId,
        doctorId,
        pharmacyId: dto.pharmacyId,
        notes: dto.notes,
        diagnosis: dto.diagnosis ?? null,
        instructions: dto.instructions ?? null,
        medications: dto.medications ?? null,
      },
    });
    await this.auditService.record(
      doctorId,
      'PRESCRIPTION_CREATED',
      'Prescription',
      prescription.id,
      { appointmentId: dto.appointmentId, pharmacyId: dto.pharmacyId },
    );
    return prescription;
  }

  async signByDoctor(doctorId: string, prescriptionId: string, dto?: UpdatePrescriptionNotesDto) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);
    this.transitionOrThrow(prescription.status, PrescriptionStatus.SIGNED);
    await this.assertLabDependencySatisfied(prescription.appointment);

    const prescriptionUpdated = await db.prescription.update({
      where: { id: prescriptionId },
      data: {
        status: PrescriptionStatus.SIGNED,
        ...(dto?.notes ? { notes: dto.notes } : {}),
        ...(dto?.diagnosis !== undefined ? { diagnosis: dto.diagnosis } : {}),
        ...(dto?.instructions !== undefined ? { instructions: dto.instructions } : {}),
        ...(dto?.medications !== undefined ? { medications: dto.medications } : {}),
      },
    });
    await this.auditService.record(
      doctorId,
      'PRESCRIPTION_SIGNED',
      'Prescription',
      prescriptionId,
    );
    return prescriptionUpdated;
  }

  async sendToPatientByDoctor(doctorId: string, prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);
    this.transitionOrThrow(prescription.status, PrescriptionStatus.SENT_TO_PATIENT);

    const updated = await db.prescription.update({
      where: { id: prescriptionId },
      data: { status: PrescriptionStatus.SENT_TO_PATIENT },
    });
    await this.notificationsService.createAndEmit(
      prescription.appointment.patientId,
      NotificationType.PRESCRIPTION_READY,
      'Your prescription is ready.',
      { prescriptionId },
      doctorId,
    );
    await this.auditService.record(
      doctorId,
      'PRESCRIPTION_SENT_TO_PATIENT',
      'Prescription',
      prescriptionId,
    );
    return updated;
  }

  async sendToPharmacyByDoctor(doctorId: string, prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);
    this.transitionOrThrow(prescription.status, PrescriptionStatus.SENT_TO_PHARMACY);

    const updated = await db.prescription.update({
      where: { id: prescriptionId },
      data: { status: PrescriptionStatus.SENT_TO_PHARMACY },
    });
    await this.notificationsService.createAndEmit(
      prescription.pharmacyId,
      NotificationType.PRESCRIPTION_READY,
      'A prescription is ready for fulfillment.',
      { prescriptionId },
      doctorId,
    );
    await this.auditService.record(
      doctorId,
      'PRESCRIPTION_SENT_TO_PHARMACY',
      'Prescription',
      prescriptionId,
    );
    return updated;
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

    const dispensed = await db.prescription.update({
      where: { id: prescriptionId },
      data: { status: PrescriptionStatus.DISPENSED },
    });
    await this.auditService.record(
      pharmacyId,
      'PRESCRIPTION_DISPENSED',
      'Prescription',
      prescriptionId,
    );
    return dispensed;
  }

  async uploadDocumentByDoctor(
    doctorId: string,
    prescriptionId: string,
    file: UploadedPrescriptionFile | undefined,
  ) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);

    if (!file) {
      throw new BadRequestException('Prescription document file is required');
    }
    const allowedMime = /^application\/pdf$|^image\/(png|jpeg|jpg|webp)$/i.test(file.mimetype);
    if (!allowedMime) {
      throw new BadRequestException('Supported formats are PDF, PNG, JPG, or WEBP');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('Prescription document must be 10MB or less');
    }

    const upload = await this.cloudinaryService.uploadBuffer({
      buffer: file.buffer,
      fileName: file.originalname || `prescription-${prescription.id}`,
      folder: 'prescriptions',
      contentType: file.mimetype,
      resourceType: file.mimetype === 'application/pdf' ? 'raw' : 'image',
    });

    if (prescription.documentPublicId) {
      await this.cloudinaryService.destroy(
        prescription.documentPublicId,
        prescription.documentMimeType?.startsWith('image/') ? 'image' : 'raw',
      );
    }

    const updated = await db.prescription.update({
      where: { id: prescriptionId },
      data: {
        documentUrl: upload.url,
        documentPublicId: upload.publicId,
        documentMimeType: upload.mimeType,
        documentVersion: (prescription.documentVersion ?? 0) + 1,
      },
    });

    await this.auditService.record(
      doctorId,
      'PRESCRIPTION_DOCUMENT_UPLOADED',
      'Prescription',
      prescriptionId,
      {
        documentPublicId: updated.documentPublicId,
        documentVersion: updated.documentVersion,
      },
    );
    return updated;
  }

  listMine(userId: string, role: Role) {
    const db = this.prisma as any;
    if (role === Role.DOCTOR) {
      return db.prescription.findMany({
        where: { doctorId: userId },
        include: {
          appointment: {
            include: {
              patient: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
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

  private async getPrescriptionWithAppointmentOrThrow(
    prescriptionId: string,
  ): Promise<any> {
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
