import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

const EVENT_BY_TYPE: Record<NotificationType, string> = {
  APPOINTMENT_CALLED: 'appointment.called',
  LAB_RESULT_UPLOADED: 'lab.result_uploaded',
  PRESCRIPTION_READY: 'prescription.ready',
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
    private readonly auditService: AuditService,
  ) {}

  async createAndEmit(
    userId: string,
    type: NotificationType,
    message: string,
    payload?: Record<string, unknown>,
    actorUserId?: string | null,
  ) {
    const db = this.prisma as any;
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });

    this.emitToUser(userId, EVENT_BY_TYPE[type], {
      notification,
      payload: payload ?? null,
    });
    await this.auditService.record(
      actorUserId ?? null,
      'NOTIFICATION_CREATED',
      'Notification',
      notification.id,
      {
        notificationType: type,
        recipientUserId: userId,
      },
    );
    return notification;
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.gateway.emitToUser(userId, event, payload);
  }

  listMine(userId: string) {
    const db = this.prisma as any;
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(userId: string, notificationId: string, read = true) {
    const db = this.prisma as any;
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this notification');
    }

    return db.notification.update({
      where: { id: notificationId },
      data: { read },
    });
  }

  markAllRead(userId: string) {
    const db = this.prisma as any;
    return db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
