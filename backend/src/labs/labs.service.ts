import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UploadLabResultDto } from './dto/upload-lab-result.dto';

type LabOrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'SAMPLE_COLLECTED'
  | 'RESULT_UPLOADED'
  | 'SENT';

const TRANSITIONS: Record<LabOrderStatus, LabOrderStatus[]> = {
  CREATED: ['ASSIGNED'],
  ASSIGNED: ['SAMPLE_COLLECTED'],
  SAMPLE_COLLECTED: ['RESULT_UPLOADED'],
  RESULT_UPLOADED: ['SENT'],
  SENT: [],
};

@Injectable()
export class LabsService {
  constructor(private readonly prisma: PrismaService) {}

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
      select: { id: true, role: true },
    });
    if (!diagnostic || diagnostic.role !== Role.DIAGNOSTIC) {
      throw new BadRequestException('diagnosticId must belong to a diagnostic user');
    }

    const existing = await db.labOrder.findUnique({
      where: { appointmentId: dto.appointmentId },
    });
    if (existing) {
      throw new BadRequestException('Lab order already exists for this appointment');
    }

    await db.appointment.update({
      where: { id: dto.appointmentId },
      data: { requiresLab: true, labFlowLocked: true },
    });

    return db.labOrder.create({
      data: {
        appointmentId: dto.appointmentId,
        diagnosticId: dto.diagnosticId,
      },
    });
  }

  async assignOrder(diagnosticId: string, orderId: string) {
    return this.updateByDiagnosticTransition(diagnosticId, orderId, 'ASSIGNED');
  }

  async collectSample(diagnosticId: string, orderId: string) {
    return this.updateByDiagnosticTransition(diagnosticId, orderId, 'SAMPLE_COLLECTED');
  }

  async uploadResult(diagnosticId: string, orderId: string, dto: UploadLabResultDto) {
    const db = this.prisma as any;
    const order = await this.getOrderOrThrow(orderId);
    this.assertDiagnosticOwnership(order.diagnosticId, diagnosticId);
    this.transitionOrThrow(order.status, 'RESULT_UPLOADED');

    const existingResult = await db.labResult.findUnique({
      where: { labOrderId: orderId },
    });
    if (existingResult) {
      throw new BadRequestException('Lab result already uploaded for this order');
    }

    await db.labOrder.update({
      where: { id: orderId },
      data: { status: 'RESULT_UPLOADED' },
    });

    const result = await db.labResult.create({
      data: {
        labOrderId: orderId,
        fileUrl: dto.fileUrl,
      },
    });

    await db.appointment.update({
      where: { id: order.appointmentId },
      data: { labFlowLocked: false },
    });

    return result;
  }

  async markSent(diagnosticId: string, orderId: string) {
    return this.updateByDiagnosticTransition(diagnosticId, orderId, 'SENT');
  }

  listMine(userId: string, role: Role) {
    const db = this.prisma as any;
    if (role === Role.DOCTOR) {
      return db.labOrder.findMany({
        where: {
          appointment: {
            doctorId: userId,
          },
        },
        include: {
          appointment: true,
          labResult: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (role === Role.PATIENT) {
      return db.labOrder.findMany({
        where: {
          appointment: {
            patientId: userId,
          },
        },
        include: {
          appointment: true,
          labResult: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (role === Role.DIAGNOSTIC) {
      return db.labOrder.findMany({
        where: { diagnosticId: userId },
        include: {
          appointment: true,
          labResult: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    throw new ForbiddenException('Role cannot view lab orders');
  }

  async getResult(userId: string, role: Role, orderId: string) {
    const db = this.prisma as any;
    const order = await db.labOrder.findUnique({
      where: { id: orderId },
      include: { appointment: true, labResult: true },
    });
    if (!order) {
      throw new NotFoundException('Lab order not found');
    }
    if (!order.labResult) {
      throw new NotFoundException('Lab result not found');
    }

    if (role === Role.DOCTOR && order.appointment.doctorId === userId) {
      return order.labResult;
    }
    if (role === Role.PATIENT && order.appointment.patientId === userId) {
      return order.labResult;
    }
    if (role === Role.DIAGNOSTIC && order.diagnosticId === userId) {
      return order.labResult;
    }

    throw new ForbiddenException('You are not allowed to access this lab result');
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
