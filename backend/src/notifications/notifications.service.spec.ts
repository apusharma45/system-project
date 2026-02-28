import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const prismaMock = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  const gatewayMock = {
    emitToUser: jest.fn(),
  };
  const auditMock = {
    record: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: NotificationsGateway,
          useValue: gatewayMock,
        },
        {
          provide: AuditService,
          useValue: auditMock,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('createAndEmit persists and emits mapped event', async () => {
    prismaMock.notification.create.mockResolvedValueOnce({
      id: 'n1',
      userId: 'u1',
      type: 'APPOINTMENT_CALLED',
      message: 'm',
      read: false,
    });

    const result = await service.createAndEmit(
      'u1',
      'APPOINTMENT_CALLED',
      'm',
      { appointmentId: 'a1' },
    );

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        type: 'APPOINTMENT_CALLED',
        message: 'm',
      },
    });
    expect(gatewayMock.emitToUser).toHaveBeenCalledWith('u1', 'appointment.called', {
      notification: result,
      payload: { appointmentId: 'a1' },
    });
    expect(auditMock.record).toHaveBeenCalledWith(
      null,
      'NOTIFICATION_CREATED',
      'Notification',
      'n1',
      { notificationType: 'APPOINTMENT_CALLED', recipientUserId: 'u1' },
    );
  });

  it('listMine returns newest notifications first', async () => {
    prismaMock.notification.findMany.mockResolvedValueOnce([]);
    await service.listMine('u1');
    expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('markRead checks ownership and updates state', async () => {
    prismaMock.notification.findUnique
      .mockResolvedValueOnce({ id: 'n1', userId: 'u1' })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'n2', userId: 'other' });
    prismaMock.notification.update.mockResolvedValueOnce({ id: 'n1', read: true });

    const result = await service.markRead('u1', 'n1');
    expect(result.read).toBe(true);

    await expect(service.markRead('u1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.markRead('u1', 'n2')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('markAllRead marks only unread notifications for user', async () => {
    prismaMock.notification.updateMany.mockResolvedValueOnce({ count: 3 });
    const result = await service.markAllRead('u1');
    expect(result.count).toBe(3);
    expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'u1', read: false },
      data: { read: true },
    });
  });
});
