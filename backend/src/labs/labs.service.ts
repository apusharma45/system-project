import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, NotificationType, Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';

type LabOrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'SAMPLE_COLLECTED'
  | 'SENT';

type UploadedLabFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

type StoredLabReport = {
  id: string;
  labOrderId: string;
  fileUrl: string;
  filePublicId?: string | null;
  fileMimeType?: string | null;
  fileSizeBytes?: number | null;
  uploadedAt: Date;
};

const TRANSITIONS: Record<LabOrderStatus, LabOrderStatus[]> = {
  CREATED: ['ASSIGNED'],
  ASSIGNED: ['SAMPLE_COLLECTED'],
  SAMPLE_COLLECTED: ['SENT'],
  SENT: [],
};

@Injectable()
export class LabsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createOrder(doctorId: string, dto: CreateLabOrderDto) {
    const db = this.prisma as any;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException('You can only create lab orders for your own appointments');
    }
    if (
      appointment.status !== AppointmentStatus.IN_VISIT &&
      appointment.status !== AppointmentStatus.EXAM_DONE
    ) {
      throw new BadRequestException('Lab order can be created only in IN_VISIT or EXAM_DONE');
    }

    const diagnostic = await this.prisma.user.findUnique({
      where: { id: dto.diagnosticId },
      select: {
        id: true,
        role: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        professionalProfile: {
          select: {
            labName: true,
          },
        },
      },
    });
    if (!diagnostic || diagnostic.role !== Role.DIAGNOSTIC) {
      throw new BadRequestException('diagnosticId must belong to a diagnostic user');
    }

    await db.appointment.update({
      where: { id: dto.appointmentId },
      data: { requiresLab: true, labFlowLocked: true },
    });

    const order = await db.labOrder.create({
      data: {
        appointmentId: dto.appointmentId,
        diagnosticId: dto.diagnosticId,
        tests: dto.tests as any,
      },
    });
    const diagnosticName =
      diagnostic.professionalProfile?.labName?.trim() ||
      diagnostic.fullName?.trim() ||
      diagnostic.email;
    await this.notificationsService.createAndEmit(
      appointment.patientId,
      NotificationType.LAB_ASSIGNED,
      `Lab assigned: ${diagnosticName}. Address: ${diagnostic.address?.trim() || 'Not provided'}. Phone: ${diagnostic.phone?.trim() || 'Not provided'}.`,
      {
        appointmentId: dto.appointmentId,
        labOrderId: order.id,
        diagnosticId: diagnostic.id,
        diagnosticName,
        diagnosticAddress: diagnostic.address ?? null,
        diagnosticPhone: diagnostic.phone ?? null,
      },
      doctorId,
    );
    await this.auditService.record(doctorId, 'LAB_ORDER_CREATED', 'LabOrder', order.id, {
      appointmentId: dto.appointmentId,
      diagnosticId: dto.diagnosticId,
    });
    return order;
  }

  async assignOrder(diagnosticId: string, orderId: string) {
    const order = await this.updateByDiagnosticTransition(diagnosticId, orderId, 'ASSIGNED');
    await this.auditService.record(diagnosticId, 'LAB_ORDER_ASSIGNED', 'LabOrder', order.id);
    return order;
  }

  async collectSample(diagnosticId: string, orderId: string) {
    const order = await this.updateByDiagnosticTransition(
      diagnosticId,
      orderId,
      'SAMPLE_COLLECTED',
    );
    await this.auditService.record(diagnosticId, 'LAB_SAMPLE_COLLECTED', 'LabOrder', order.id);
    return order;
  }

  async uploadResult(diagnosticId: string, orderId: string, files?: UploadedLabFile[]) {
    const db = this.prisma as any;
    const order = await this.getOrderOrThrow(orderId);
    this.assertDiagnosticOwnership(order.diagnosticId, diagnosticId);

    if (!files?.length) {
      throw new BadRequestException('At least one lab result file is required');
    }

    const preparedUploads = await Promise.all(
      files.map((file) => this.uploadFileToCloudinary(orderId, file)),
    );

    if (order.status !== 'SENT') {
      await db.labOrder.update({
        where: { id: orderId },
        data: { status: 'SENT' },
      });
    }

    const reports: StoredLabReport[] = [];
    for (const upload of preparedUploads) {
      const report = await db.labResult.create({
        data: {
          labOrderId: orderId,
          fileUrl: upload.fileUrl,
          filePublicId: upload.filePublicId ?? null,
          fileMimeType: upload.fileMimeType ?? null,
          fileSizeBytes: upload.fileSizeBytes ?? null,
        },
      });
      reports.push(report);
    }

    const pendingOrder = await db.labOrder.findFirst({
      where: {
        appointmentId: order.appointmentId,
        labReports: { none: {} },
      },
      select: { id: true },
    });

    await db.appointment.update({
      where: { id: order.appointmentId },
      data: { labFlowLocked: Boolean(pendingOrder) },
    });

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: order.appointmentId },
      select: { id: true, doctorId: true, patientId: true },
    });

    if (appointment) {
      for (const report of reports) {
        await this.notificationsService.createAndEmit(
          appointment.doctorId,
          NotificationType.LAB_RESULT_UPLOADED,
          'Lab result uploaded for your appointment.',
          { appointmentId: appointment.id, labOrderId: orderId, labReportId: report.id },
          diagnosticId,
        );
        await this.notificationsService.createAndEmit(
          appointment.patientId,
          NotificationType.LAB_RESULT_UPLOADED,
          'Lab result uploaded for your appointment.',
          { appointmentId: appointment.id, labOrderId: orderId, labReportId: report.id },
          diagnosticId,
        );
      }
    }

    await this.auditService.record(diagnosticId, 'LAB_RESULT_UPLOADED', 'LabOrder', order.id, {
      appointmentId: order.appointmentId,
      uploadedCount: reports.length,
      uploadedReportIds: reports.map((item) => item.id),
    });

    return {
      labOrderId: orderId,
      uploadedCount: reports.length,
      reports,
    };
  }

  async markSent(diagnosticId: string, orderId: string) {
    const order = await this.updateByDiagnosticTransition(diagnosticId, orderId, 'SENT');
    await this.auditService.record(diagnosticId, 'LAB_ORDER_SENT', 'LabOrder', order.id);
    return order;
  }

  async listMine(userId: string, role: Role) {
    const db = this.prisma as any;
    if (role === Role.DOCTOR) {
      const rows = await db.labOrder.findMany({
        where: {
          appointment: {
            doctorId: userId,
          },
        },
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
          labReports: { orderBy: { uploadedAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((row: any) => this.mapOrderOutput(row, false));
    }
    if (role === Role.PATIENT) {
      const rows = await db.labOrder.findMany({
        where: {
          appointment: {
            patientId: userId,
          },
        },
        include: {
          appointment: true,
          diagnostic: {
            select: {
              fullName: true,
              email: true,
              phone: true,
              address: true,
              professionalProfile: {
                select: {
                  labName: true,
                },
              },
            },
          },
          labReports: { orderBy: { uploadedAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((row: any) => this.mapOrderOutput(row, false));
    }
    if (role === Role.DIAGNOSTIC) {
      const rows = await db.labOrder.findMany({
        where: { diagnosticId: userId },
        include: {
          appointment: {
            include: {
              patient: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                  patientProfile: {
                    select: {
                      dateOfBirth: true,
                      gender: true,
                    },
                  },
                },
              },
            },
          },
          labReports: { orderBy: { uploadedAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((row: any) => this.mapOrderOutput(row, true));
    }

    throw new ForbiddenException('Role cannot view lab orders');
  }

  async getResult(userId: string, role: Role, orderId: string) {
    const db = this.prisma as any;
    const order = await db.labOrder.findUnique({
      where: { id: orderId },
      include: { appointment: true, labReports: { orderBy: { uploadedAt: 'desc' } } },
    });
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }

    const latestReport = order.labReports?.[0] ?? null;
    if (!latestReport) {
      throw new NotFoundException('Lab result not found');
    }

    if (role === Role.DOCTOR && order.appointment.doctorId === userId) {
      return latestReport;
    }
    if (role === Role.PATIENT && order.appointment.patientId === userId) {
      return latestReport;
    }
    if (role === Role.DIAGNOSTIC && order.diagnosticId === userId) {
      return latestReport;
    }

    throw new ForbiddenException('You are not allowed to access this lab result');
  }

  private async uploadFileToCloudinary(orderId: string, file: UploadedLabFile) {
    const allowedMime = /^application\/pdf$|^image\/(png|jpeg|jpg|webp)$/i.test(file.mimetype);
    if (!allowedMime) {
      throw new BadRequestException('Supported formats are PDF, PNG, JPG, or WEBP');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('Lab result file must be 10MB or less');
    }

    const upload = await this.cloudinaryService.uploadBuffer({
      buffer: file.buffer,
      fileName: file.originalname || `lab-report-${orderId}`,
      folder: `lab-reports/${orderId}`,
      contentType: file.mimetype,
      resourceType: file.mimetype === 'application/pdf' ? 'raw' : 'image',
    });

    return {
      fileUrl: upload.url,
      filePublicId: upload.publicId,
      fileMimeType: upload.mimeType,
      fileSizeBytes: upload.bytes,
    };
  }

  private mapOrderOutput(order: any, includeDiagnosticSnapshot: boolean) {
    const labReports = Array.isArray(order.labReports) ? order.labReports : [];
    const latestReport = labReports[0] ?? null;
    const patientProfile = order.appointment?.patient?.patientProfile;
    const diagnosticProfile = order.diagnostic?.professionalProfile;
    const diagnosticName =
      diagnosticProfile?.labName?.trim() ||
      order.diagnostic?.fullName?.trim() ||
      order.diagnostic?.email?.trim() ||
      'Not provided';

    return {
      ...order,
      labReports,
      latestReport,
      // compatibility field used by existing screens while migration completes
      labResult: latestReport,
      ...(includeDiagnosticSnapshot
        ? {
            patientClinicalSnapshot: {
              fullName: order.appointment?.patient?.fullName ?? null,
              email: order.appointment?.patient?.email ?? null,
              phone: order.appointment?.patient?.phone ?? null,
              gender: patientProfile?.gender ?? null,
              ageYears: this.getAgeYears(patientProfile?.dateOfBirth),
            },
          }
        : order.diagnostic
          ? {
            diagnosticSnapshot: {
              name: diagnosticName,
              address: order.diagnostic?.address ?? null,
              phone: order.diagnostic?.phone ?? null,
            },
            }
          : {}),
    };
  }

  private getAgeYears(dateOfBirth: Date | string | null | undefined): number | null {
    if (!dateOfBirth) {
      return null;
    }
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      return null;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age >= 0 ? age : null;
  }

  private async updateByDiagnosticTransition(
    diagnosticId: string,
    orderId: string,
    nextStatus: LabOrderStatus,
  ) {
    const db = this.prisma as any;
    const order = await this.getOrderOrThrow(orderId);
    this.assertDiagnosticOwnership(order.diagnosticId, diagnosticId);
    this.transitionOrThrow(order.status, nextStatus);

    return db.labOrder.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });
  }

  private async getOrderOrThrow(orderId: string) {
    const db = this.prisma as any;
    const order = await db.labOrder.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }
    return order;
  }

  private assertDiagnosticOwnership(ownerDiagnosticId: string, diagnosticId: string) {
    if (ownerDiagnosticId !== diagnosticId) {
      throw new ForbiddenException('You can only modify your own lab orders');
    }
  }

  private transitionOrThrow(current: LabOrderStatus, next: LabOrderStatus) {
    if (!TRANSITIONS[current].includes(next)) {
      throw new BadRequestException(`Invalid transition: ${current} -> ${next}`);
    }
  }
}
