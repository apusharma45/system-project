"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_gateway_1 = require("./notifications.gateway");
const EVENT_BY_TYPE = {
    APPOINTMENT_CALLED: 'appointment.called',
    LAB_ASSIGNED: 'lab.assigned',
    LAB_RESULT_UPLOADED: 'lab.result_uploaded',
    PRESCRIPTION_READY: 'prescription.ready',
};
let NotificationsService = class NotificationsService {
    prisma;
    gateway;
    auditService;
    constructor(prisma, gateway, auditService) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.auditService = auditService;
    }
    async createAndEmit(userId, type, message, payload, actorUserId) {
        const db = this.prisma;
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
        await this.auditService.record(actorUserId ?? null, 'NOTIFICATION_CREATED', 'Notification', notification.id, {
            notificationType: type,
            recipientUserId: userId,
        });
        return notification;
    }
    emitToUser(userId, event, payload) {
        this.gateway.emitToUser(userId, event, payload);
    }
    listMine(userId) {
        const db = this.prisma;
        return db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markRead(userId, notificationId, read = true) {
        const db = this.prisma;
        const notification = await db.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to update this notification');
        }
        return db.notification.update({
            where: { id: notificationId },
            data: { read },
        });
    }
    markAllRead(userId) {
        const db = this.prisma;
        return db.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway,
        audit_service_1.AuditService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map