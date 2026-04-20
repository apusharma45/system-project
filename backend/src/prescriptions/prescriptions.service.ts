import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PDFDocument from 'pdfkit';
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

type PharmacySnapshot = {
  id: string;
  name: string;
  pharmacyName: string | null;
  fullName: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
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

  async generateDocumentByDoctor(doctorId: string, prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await this.getPrescriptionForDocumentGenerationOrThrow(prescriptionId);
    this.assertDoctorOwnership(prescription.doctorId, doctorId);

    const pdfBuffer = await this.buildPrescriptionPdfBuffer(prescription);
    const upload = await this.cloudinaryService.uploadBuffer({
      buffer: pdfBuffer,
      fileName: `prescription-${prescription.id}.pdf`,
      folder: 'prescriptions',
      contentType: 'application/pdf',
      resourceType: 'raw',
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
      'PRESCRIPTION_DOCUMENT_GENERATED',
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
          pharmacy: {
            select: {
              id: true,
              fullName: true,
              email: true,
              professionalProfile: {
                select: {
                  pharmacyName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }).then((items: any[]) => items.map((item) => this.withPharmacySnapshot(item)));
    }
    if (role === Role.PHARMACY) {
      return db.prescription.findMany({
        where: { pharmacyId: userId },
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
              doctor: {
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
    if (role === Role.PATIENT) {
      return db.prescription.findMany({
        where: {
          appointment: { patientId: userId },
        },
        include: {
          appointment: true,
          pharmacy: {
            select: {
              id: true,
              fullName: true,
              email: true,
              address: true,
              phone: true,
              professionalProfile: {
                select: {
                  pharmacyName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }).then((items: any[]) => items.map((item) => this.withPharmacySnapshot(item)));
    }

    throw new ForbiddenException('Role cannot view prescriptions');
  }

  async getOne(userId: string, role: Role, prescriptionId: string) {
    const db = this.prisma as any;
    const prescription = await db.prescription.findUnique({
      where: { id: prescriptionId },
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
            doctor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        pharmacy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            professionalProfile: {
              select: {
                pharmacyName: true,
              },
            },
          },
        },
      },
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (role === Role.DOCTOR && prescription.doctorId === userId) {
      return this.withPharmacySnapshot(prescription);
    }
    if (role === Role.PHARMACY && prescription.pharmacyId === userId) {
      return prescription;
    }
    if (role === Role.PATIENT && prescription.appointment.patientId === userId) {
      return this.withPharmacySnapshot(prescription);
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

  private async getPrescriptionForDocumentGenerationOrThrow(
    prescriptionId: string,
  ): Promise<any> {
    const db = this.prisma as any;
    const prescription = await db.prescription.findUnique({
      where: { id: prescriptionId },
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
            doctor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        pharmacy: {
          select: {
            fullName: true,
            email: true,
            address: true,
            phone: true,
            professionalProfile: {
              select: {
                pharmacyName: true,
              },
            },
          },
        },
      },
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

  private withPharmacySnapshot(prescription: any) {
    const snapshot = this.getPharmacySnapshot(prescription);
    return {
      ...prescription,
      pharmacySnapshot: snapshot,
    };
  }

  private getPharmacySnapshot(prescription: any): PharmacySnapshot {
    const pharmacyName = prescription.pharmacy?.professionalProfile?.pharmacyName ?? null;
    const fullName = prescription.pharmacy?.fullName ?? null;
    const email = prescription.pharmacy?.email ?? null;
    const address = prescription.pharmacy?.address ?? null;
    const phone = prescription.pharmacy?.phone ?? null;
    const name = pharmacyName ?? fullName ?? email ?? 'Not assigned';

    return {
      id: prescription.pharmacyId,
      name,
      pharmacyName,
      fullName,
      email,
      address,
      phone,
    };
  }

  private buildPrescriptionPdfBuffer(prescription: any): Promise<Buffer> {
    const meds = Array.isArray(prescription.medications) ? prescription.medications : [];
    const doctorName =
      prescription.appointment?.doctor?.fullName ||
      prescription.appointment?.doctor?.email ||
      'Unknown doctor';
    const patientName =
      prescription.appointment?.patient?.fullName ||
      prescription.appointment?.patient?.email ||
      'Unknown patient';
    const pharmacyName =
      prescription.pharmacy?.professionalProfile?.pharmacyName ||
      prescription.pharmacy?.fullName ||
      prescription.pharmacy?.email ||
      'Not assigned';

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 48 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text('Prescription');
      doc.moveDown(0.5);
      doc.fontSize(11);
      doc.text(`Prescription ID: ${prescription.id}`);
      doc.text(`Appointment ID: ${prescription.appointmentId}`);
      doc.text(`Doctor: ${doctorName}`);
      doc.text(`Patient: ${patientName}`);
      doc.text(`Status: ${prescription.status}`);
      doc.moveDown(0.5);
      doc.text(`Diagnosis: ${prescription.diagnosis || 'Not provided'}`);
      doc.text(`Instructions: ${prescription.instructions || 'Not provided'}`);
      doc.text(`Doctor Advice: ${prescription.notes || 'Not provided'}`);
      doc.moveDown(0.5);
      doc.text(`Pharmacy: ${pharmacyName}`);
      doc.text(`Pharmacy Address: ${prescription.pharmacy?.address || 'Not provided'}`);
      doc.text(`Pharmacy Phone: ${prescription.pharmacy?.phone || 'Not provided'}`);
      doc.moveDown(0.8);
      doc.fontSize(13).text('Medications');
      doc.fontSize(11);
      if (meds.length) {
        meds.forEach((med: any, idx: number) => {
          doc.text(`${idx + 1}. ${med?.name || 'Unnamed'}`);
          doc.text(`   Dosage: ${med?.dosage || 'Not provided'}`);
          doc.text(`   Frequency: ${med?.frequency || 'Not provided'}`);
          doc.text(`   Duration: ${med?.duration || 'Not provided'}`);
          doc.text(`   Route: ${med?.route || 'Not provided'}`);
          doc.moveDown(0.2);
        });
      } else {
        doc.text('- No medications listed');
      }
      doc.end();
    });
  }
}
