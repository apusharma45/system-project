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
exports.LabsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const audit_service_1 = require("../audit/audit.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const TRANSITIONS = {
    CREATED: ['ASSIGNED'],
    ASSIGNED: ['SAMPLE_COLLECTED'],
    SAMPLE_COLLECTED: ['RESULT_UPLOADED'],
    RESULT_UPLOADED: ['SENT'],
    SENT: [],
};
let LabsService = class LabsService {
    prisma;
    notificationsService;
    auditService;
    constructor(prisma, notificationsService, auditService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.auditService = auditService;
    }
    async createOrder(doctorId, dto) {
        const db = this.prisma;
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.ForbiddenException('You can only create lab orders for your own appointments');
        }
        if (appointment.status !== client_1.AppointmentStatus.IN_VISIT &&
            appointment.status !== client_1.AppointmentStatus.EXAM_DONE) {
            throw new common_1.BadRequestException('Lab order can be created only in IN_VISIT or EXAM_DONE');
        }
        const diagnostic = await this.prisma.user.findUnique({
            where: { id: dto.diagnosticId },
            select: { id: true, role: true },
        });
        if (!diagnostic || diagnostic.role !== client_1.Role.DIAGNOSTIC) {
            throw new common_1.BadRequestException('diagnosticId must belong to a diagnostic user');
        }
        const existing = await db.labOrder.findUnique({
            where: { appointmentId: dto.appointmentId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Lab order already exists for this appointment');
        }
        await db.appointment.update({
            where: { id: dto.appointmentId },
            data: { requiresLab: true, labFlowLocked: true },
        });
        const order = await db.labOrder.create({
            data: {
                appointmentId: dto.appointmentId,
                diagnosticId: dto.diagnosticId,
            },
        });
        await this.auditService.record(doctorId, 'LAB_ORDER_CREATED', 'LabOrder', order.id, {
            appointmentId: dto.appointmentId,
            diagnosticId: dto.diagnosticId,
        });
        return order;
    }
    async assignOrder(diagnosticId, orderId) {
        const order = await this.updateByDiagnosticTransition(diagnosticId, orderId, 'ASSIGNED');
        await this.auditService.record(diagnosticId, 'LAB_ORDER_ASSIGNED', 'LabOrder', order.id);
        return order;
    }
    async collectSample(diagnosticId, orderId) {
        const order = await this.updateByDiagnosticTransition(diagnosticId, orderId, 'SAMPLE_COLLECTED');
        await this.auditService.record(diagnosticId, 'LAB_SAMPLE_COLLECTED', 'LabOrder', order.id);
        return order;
    }
    async uploadResult(diagnosticId, orderId, dto) {
        const db = this.prisma;
        const order = await this.getOrderOrThrow(orderId);
        this.assertDiagnosticOwnership(order.diagnosticId, diagnosticId);
        this.transitionOrThrow(order.status, 'RESULT_UPLOADED');
        const existingResult = await db.labResult.findUnique({
            where: { labOrderId: orderId },
        });
        if (existingResult) {
            throw new common_1.BadRequestException('Lab result already uploaded for this order');
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
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: order.appointmentId },
            select: { id: true, doctorId: true, patientId: true },
        });
        if (appointment) {
            await this.notificationsService.createAndEmit(appointment.doctorId, client_1.NotificationType.LAB_RESULT_UPLOADED, 'Lab result uploaded for your appointment.', { appointmentId: appointment.id, labOrderId: orderId }, diagnosticId);
            await this.notificationsService.createAndEmit(appointment.patientId, client_1.NotificationType.LAB_RESULT_UPLOADED, 'Lab result uploaded for your appointment.', { appointmentId: appointment.id, labOrderId: orderId }, diagnosticId);
        }
        await this.auditService.record(diagnosticId, 'LAB_RESULT_UPLOADED', 'LabOrder', order.id, {
            appointmentId: order.appointmentId,
        });
        return result;
    }
    async markSent(diagnosticId, orderId) {
        const order = await this.updateByDiagnosticTransition(diagnosticId, orderId, 'SENT');
        await this.auditService.record(diagnosticId, 'LAB_ORDER_SENT', 'LabOrder', order.id);
        return order;
    }
    listMine(userId, role) {
        const db = this.prisma;
        if (role === client_1.Role.DOCTOR) {
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
        if (role === client_1.Role.PATIENT) {
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
        if (role === client_1.Role.DIAGNOSTIC) {
            return db.labOrder.findMany({
                where: { diagnosticId: userId },
                include: {
                    appointment: true,
                    labResult: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        throw new common_1.ForbiddenException('Role cannot view lab orders');
    }
    async getResult(userId, role, orderId) {
        const db = this.prisma;
        const order = await db.labOrder.findUnique({
            where: { id: orderId },
            include: { appointment: true, labResult: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        if (!order.labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        if (role === client_1.Role.DOCTOR && order.appointment.doctorId === userId) {
            return order.labResult;
        }
        if (role === client_1.Role.PATIENT && order.appointment.patientId === userId) {
            return order.labResult;
        }
        if (role === client_1.Role.DIAGNOSTIC && order.diagnosticId === userId) {
            return order.labResult;
        }
        throw new common_1.ForbiddenException('You are not allowed to access this lab result');
    }
    async updateByDiagnosticTransition(diagnosticId, orderId, nextStatus) {
        const db = this.prisma;
        const order = await this.getOrderOrThrow(orderId);
        this.assertDiagnosticOwnership(order.diagnosticId, diagnosticId);
        this.transitionOrThrow(order.status, nextStatus);
        return db.labOrder.update({
            where: { id: orderId },
            data: { status: nextStatus },
        });
    }
    async getOrderOrThrow(orderId) {
        const db = this.prisma;
        const order = await db.labOrder.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return order;
    }
    assertDiagnosticOwnership(ownerDiagnosticId, diagnosticId) {
        if (ownerDiagnosticId !== diagnosticId) {
            throw new common_1.ForbiddenException('You can only modify your own lab orders');
        }
    }
    transitionOrThrow(current, next) {
        if (!TRANSITIONS[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid transition: ${current} -> ${next}`);
        }
    }
};
exports.LabsService = LabsService;
exports.LabsService = LabsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        audit_service_1.AuditService])
], LabsService);
//# sourceMappingURL=labs.service.js.map