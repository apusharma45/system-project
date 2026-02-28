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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const audit_service_1 = require("../audit/audit.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const TRANSITIONS = {
    DRAFT: [client_1.PrescriptionStatus.SIGNED],
    SIGNED: [client_1.PrescriptionStatus.SENT_TO_PATIENT],
    SENT_TO_PATIENT: [client_1.PrescriptionStatus.SENT_TO_PHARMACY],
    SENT_TO_PHARMACY: [client_1.PrescriptionStatus.DISPENSED],
    DISPENSED: [],
};
let PrescriptionsService = class PrescriptionsService {
    prisma;
    notificationsService;
    auditService;
    constructor(prisma, notificationsService, auditService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.auditService = auditService;
    }
    async createDraft(doctorId, dto) {
        const db = this.prisma;
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.ForbiddenException('You can only create prescriptions for your own appointments');
        }
        if (appointment.status !== client_1.AppointmentStatus.EXAM_DONE &&
            appointment.status !== client_1.AppointmentStatus.CLOSED) {
            throw new common_1.BadRequestException('Prescription can be created only when appointment is EXAM_DONE or CLOSED');
        }
        const pharmacy = await this.prisma.user.findUnique({
            where: { id: dto.pharmacyId },
            select: { id: true, role: true },
        });
        if (!pharmacy || pharmacy.role !== client_1.Role.PHARMACY) {
            throw new common_1.BadRequestException('pharmacyId must belong to a pharmacy user');
        }
        const existing = await db.prescription.findUnique({
            where: { appointmentId: dto.appointmentId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Prescription already exists for this appointment');
        }
        const prescription = await db.prescription.create({
            data: {
                appointmentId: dto.appointmentId,
                doctorId,
                pharmacyId: dto.pharmacyId,
                notes: dto.notes,
            },
        });
        await this.auditService.record(doctorId, 'PRESCRIPTION_CREATED', 'Prescription', prescription.id, { appointmentId: dto.appointmentId, pharmacyId: dto.pharmacyId });
        return prescription;
    }
    async signByDoctor(doctorId, prescriptionId, dto) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.SIGNED);
        await this.assertLabDependencySatisfied(prescription.appointment);
        const prescriptionUpdated = await db.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: client_1.PrescriptionStatus.SIGNED,
                ...(dto?.notes ? { notes: dto.notes } : {}),
            },
        });
        await this.auditService.record(doctorId, 'PRESCRIPTION_SIGNED', 'Prescription', prescriptionId);
        return prescriptionUpdated;
    }
    async sendToPatientByDoctor(doctorId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.SENT_TO_PATIENT);
        const updated = await db.prescription.update({
            where: { id: prescriptionId },
            data: { status: client_1.PrescriptionStatus.SENT_TO_PATIENT },
        });
        await this.notificationsService.createAndEmit(prescription.appointment.patientId, client_1.NotificationType.PRESCRIPTION_READY, 'Your prescription is ready.', { prescriptionId }, doctorId);
        await this.auditService.record(doctorId, 'PRESCRIPTION_SENT_TO_PATIENT', 'Prescription', prescriptionId);
        return updated;
    }
    async sendToPharmacyByDoctor(doctorId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.SENT_TO_PHARMACY);
        const updated = await db.prescription.update({
            where: { id: prescriptionId },
            data: { status: client_1.PrescriptionStatus.SENT_TO_PHARMACY },
        });
        await this.notificationsService.createAndEmit(prescription.pharmacyId, client_1.NotificationType.PRESCRIPTION_READY, 'A prescription is ready for fulfillment.', { prescriptionId }, doctorId);
        await this.auditService.record(doctorId, 'PRESCRIPTION_SENT_TO_PHARMACY', 'Prescription', prescriptionId);
        return updated;
    }
    async dispenseByPharmacy(pharmacyId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        if (prescription.pharmacyId !== pharmacyId) {
            throw new common_1.ForbiddenException('You can only dispense prescriptions assigned to your pharmacy');
        }
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.DISPENSED);
        const dispensed = await db.prescription.update({
            where: { id: prescriptionId },
            data: { status: client_1.PrescriptionStatus.DISPENSED },
        });
        await this.auditService.record(pharmacyId, 'PRESCRIPTION_DISPENSED', 'Prescription', prescriptionId);
        return dispensed;
    }
    listMine(userId, role) {
        const db = this.prisma;
        if (role === client_1.Role.DOCTOR) {
            return db.prescription.findMany({
                where: { doctorId: userId },
                include: { appointment: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (role === client_1.Role.PHARMACY) {
            return db.prescription.findMany({
                where: { pharmacyId: userId },
                include: { appointment: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (role === client_1.Role.PATIENT) {
            return db.prescription.findMany({
                where: {
                    appointment: { patientId: userId },
                },
                include: { appointment: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        throw new common_1.ForbiddenException('Role cannot view prescriptions');
    }
    async getOne(userId, role, prescriptionId) {
        const db = this.prisma;
        const prescription = await db.prescription.findUnique({
            where: { id: prescriptionId },
            include: { appointment: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (role === client_1.Role.DOCTOR && prescription.doctorId === userId) {
            return prescription;
        }
        if (role === client_1.Role.PHARMACY && prescription.pharmacyId === userId) {
            return prescription;
        }
        if (role === client_1.Role.PATIENT && prescription.appointment.patientId === userId) {
            return prescription;
        }
        throw new common_1.ForbiddenException('You are not allowed to access this prescription');
    }
    async getPrescriptionWithAppointmentOrThrow(prescriptionId) {
        const db = this.prisma;
        const prescription = await db.prescription.findUnique({
            where: { id: prescriptionId },
            include: { appointment: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return prescription;
    }
    assertDoctorOwnership(doctorIdInPrescription, doctorId) {
        if (doctorIdInPrescription !== doctorId) {
            throw new common_1.ForbiddenException('You can only modify your own prescriptions');
        }
    }
    transitionOrThrow(current, next) {
        if (!TRANSITIONS[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid transition: ${current} -> ${next}`);
        }
    }
    async assertLabDependencySatisfied(appointment) {
        if (!appointment.requiresLab) {
            return;
        }
        if (appointment.labFlowLocked) {
            throw new common_1.BadRequestException('Cannot sign prescription while lab workflow is pending');
        }
        const db = this.prisma;
        const result = await db.labResult.findFirst({
            where: {
                labOrder: {
                    appointmentId: appointment.id,
                },
            },
        });
        if (!result) {
            throw new common_1.BadRequestException('Cannot sign prescription before lab result is uploaded');
        }
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        audit_service_1.AuditService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map