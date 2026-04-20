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
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const TRANSITIONS = {
    CREATED: ['ASSIGNED'],
    ASSIGNED: ['SAMPLE_COLLECTED'],
    SAMPLE_COLLECTED: ['SENT'],
    SENT: [],
};
let LabsService = class LabsService {
    prisma;
    notificationsService;
    auditService;
    cloudinaryService;
    constructor(prisma, notificationsService, auditService, cloudinaryService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.auditService = auditService;
        this.cloudinaryService = cloudinaryService;
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
        if (!diagnostic || diagnostic.role !== client_1.Role.DIAGNOSTIC) {
            throw new common_1.BadRequestException('diagnosticId must belong to a diagnostic user');
        }
        await db.appointment.update({
            where: { id: dto.appointmentId },
            data: { requiresLab: true, labFlowLocked: true },
        });
        const order = await db.labOrder.create({
            data: {
                appointmentId: dto.appointmentId,
                diagnosticId: dto.diagnosticId,
                tests: dto.tests,
            },
        });
        const diagnosticName = diagnostic.professionalProfile?.labName?.trim() ||
            diagnostic.fullName?.trim() ||
            diagnostic.email;
        await this.notificationsService.createAndEmit(appointment.patientId, client_1.NotificationType.LAB_ASSIGNED, `Lab assigned: ${diagnosticName}. Address: ${diagnostic.address?.trim() || 'Not provided'}. Phone: ${diagnostic.phone?.trim() || 'Not provided'}.`, {
            appointmentId: dto.appointmentId,
            labOrderId: order.id,
            diagnosticId: diagnostic.id,
            diagnosticName,
            diagnosticAddress: diagnostic.address ?? null,
            diagnosticPhone: diagnostic.phone ?? null,
        }, doctorId);
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
    async uploadResult(diagnosticId, orderId, files) {
        const db = this.prisma;
        const order = await this.getOrderOrThrow(orderId);
        this.assertDiagnosticOwnership(order.diagnosticId, diagnosticId);
        if (!files?.length) {
            throw new common_1.BadRequestException('At least one lab result file is required');
        }
        const preparedUploads = await Promise.all(files.map((file) => this.uploadFileToCloudinary(orderId, file)));
        if (order.status !== 'SENT') {
            await db.labOrder.update({
                where: { id: orderId },
                data: { status: 'SENT' },
            });
        }
        const reports = [];
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
                await this.notificationsService.createAndEmit(appointment.doctorId, client_1.NotificationType.LAB_RESULT_UPLOADED, 'Lab result uploaded for your appointment.', { appointmentId: appointment.id, labOrderId: orderId, labReportId: report.id }, diagnosticId);
                await this.notificationsService.createAndEmit(appointment.patientId, client_1.NotificationType.LAB_RESULT_UPLOADED, 'Lab result uploaded for your appointment.', { appointmentId: appointment.id, labOrderId: orderId, labReportId: report.id }, diagnosticId);
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
    async markSent(diagnosticId, orderId) {
        const order = await this.updateByDiagnosticTransition(diagnosticId, orderId, 'SENT');
        await this.auditService.record(diagnosticId, 'LAB_ORDER_SENT', 'LabOrder', order.id);
        return order;
    }
    async listMine(userId, role) {
        const db = this.prisma;
        if (role === client_1.Role.DOCTOR) {
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
            return rows.map((row) => this.mapOrderOutput(row, false));
        }
        if (role === client_1.Role.PATIENT) {
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
            return rows.map((row) => this.mapOrderOutput(row, false));
        }
        if (role === client_1.Role.DIAGNOSTIC) {
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
            return rows.map((row) => this.mapOrderOutput(row, true));
        }
        throw new common_1.ForbiddenException('Role cannot view lab orders');
    }
    async getResult(userId, role, orderId) {
        const db = this.prisma;
        const order = await db.labOrder.findUnique({
            where: { id: orderId },
            include: { appointment: true, labReports: { orderBy: { uploadedAt: 'desc' } } },
        });
        if (!order) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        const latestReport = order.labReports?.[0] ?? null;
        if (!latestReport) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        if (role === client_1.Role.DOCTOR && order.appointment.doctorId === userId) {
            return latestReport;
        }
        if (role === client_1.Role.PATIENT && order.appointment.patientId === userId) {
            return latestReport;
        }
        if (role === client_1.Role.DIAGNOSTIC && order.diagnosticId === userId) {
            return latestReport;
        }
        throw new common_1.ForbiddenException('You are not allowed to access this lab result');
    }
    async uploadFileToCloudinary(orderId, file) {
        const allowedMime = /^application\/pdf$|^image\/(png|jpeg|jpg|webp)$/i.test(file.mimetype);
        if (!allowedMime) {
            throw new common_1.BadRequestException('Supported formats are PDF, PNG, JPG, or WEBP');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new common_1.BadRequestException('Lab result file must be 10MB or less');
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
    mapOrderOutput(order, includeDiagnosticSnapshot) {
        const labReports = Array.isArray(order.labReports) ? order.labReports : [];
        const latestReport = labReports[0] ?? null;
        const patientProfile = order.appointment?.patient?.patientProfile;
        const diagnosticProfile = order.diagnostic?.professionalProfile;
        const diagnosticName = diagnosticProfile?.labName?.trim() ||
            order.diagnostic?.fullName?.trim() ||
            order.diagnostic?.email?.trim() ||
            'Not provided';
        return {
            ...order,
            labReports,
            latestReport,
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
    getAgeYears(dateOfBirth) {
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
        audit_service_1.AuditService,
        cloudinary_service_1.CloudinaryService])
], LabsService);
//# sourceMappingURL=labs.service.js.map