import { NotificationType } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private readonly prisma;
    private readonly gateway;
    private readonly auditService;
    constructor(prisma: PrismaService, gateway: NotificationsGateway, auditService: AuditService);
    createAndEmit(userId: string, type: NotificationType, message: string, payload?: Record<string, unknown>, actorUserId?: string | null): Promise<any>;
    emitToUser(userId: string, event: string, payload: unknown): void;
    listMine(userId: string): any;
    markRead(userId: string, notificationId: string, read?: boolean): Promise<any>;
    markAllRead(userId: string): any;
}
