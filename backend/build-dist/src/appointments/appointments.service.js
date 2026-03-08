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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const audit_service_1 = require("../audit/audit.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const TRANSITIONS = {
    REQUESTED: [client_1.AppointmentStatus.CONFIRMED, client_1.AppointmentStatus.CANCELLED],
    CONFIRMED: [
        client_1.AppointmentStatus.CALLED,
        client_1.AppointmentStatus.IN_VISIT,
        client_1.AppointmentStatus.CANCELLED,
    ],
    CALLED: [client_1.AppointmentStatus.IN_VISIT, client_1.AppointmentStatus.CANCELLED],
    IN_VISIT: [client_1.AppointmentStatus.EXAM_DONE, client_1.AppointmentStatus.CANCELLED],
    EXAM_DONE: [client_1.AppointmentStatus.CLOSED],
    CLOSED: [],
    CANCELLED: [],
};
let AppointmentsService = class AppointmentsService {
    prisma;
    notificationsService;
    auditService;
    constructor(prisma, notificationsService, auditService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.auditService = auditService;
    }
    async createForPatient(patientId, dto) {
        const doctor = await this.prisma.user.findUnique({
            where: { id: dto.doctorId },
            select: { id: true, role: true },
        });
        if (!doctor || doctor.role !== client_1.Role.DOCTOR) {
            throw new common_1.BadRequestException('doctorId must belong to a doctor');
        }
        const reason = dto.reason?.trim();
        const preferredTimeNote = dto.preferredTimeNote?.trim();
        if (preferredTimeNote && !reason) {
            throw new common_1.BadRequestException('reason is required when preferredTimeNote is provided');
        }
        if (!dto.scheduledAt && dto.preferredDateFrom && dto.preferredDateTo) {
            const fromDate = new Date(dto.preferredDateFrom);
            const toDate = new Date(dto.preferredDateTo);
            if (toDate < fromDate) {
                throw new common_1.BadRequestException('preferredDateTo must be greater than or equal to preferredDateFrom');
            }
        }
        const appointment = await this.prisma.appointment.create({
            data: {
                patientId,
                doctorId: dto.doctorId,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                reason: reason ?? null,
                preferredDateFrom: dto.preferredDateFrom ? new Date(dto.preferredDateFrom) : null,
                preferredDateTo: dto.preferredDateTo ? new Date(dto.preferredDateTo) : null,
                preferredTimeNote: preferredTimeNote ?? null,
            },
        });
        await this.auditService.record(patientId, 'APPOINTMENT_CREATED', 'Appointment', appointment.id, {
            doctorId: dto.doctorId,
            scheduledAt: dto.scheduledAt ?? null,
            preferredDateFrom: dto.preferredDateFrom ?? null,
            preferredDateTo: dto.preferredDateTo ?? null,
            preferredTimeNote: preferredTimeNote ?? null,
            reason: reason ?? null,
        });
        return appointment;
    }
    async listMine(userId, role) {
        if (role === client_1.Role.PATIENT) {
            return this.prisma.appointment.findMany({
                where: { patientId: userId },
                orderBy: { scheduledAt: 'asc' },
            });
        }
        if (role === client_1.Role.DOCTOR) {
            const appointments = await this.prisma.appointment.findMany({
                where: { doctorId: userId },
                include: {
                    patient: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            patientProfile: true,
                        },
                    },
                },
                orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
            });
            const patientIds = [...new Set(appointments.map((item) => item.patientId))];
            const historyByPatient = new Map();
            await Promise.all(patientIds.map(async (patientId) => {
                const [appointmentCount, labOrderCount, prescriptionCount, latestAppointment, latestLab, latestPrescription] = await Promise.all([
                    this.prisma.appointment.count({ where: { patientId } }),
                    this.prisma.labOrder.count({ where: { appointment: { patientId } } }),
                    this.prisma.prescription.count({ where: { appointment: { patientId } } }),
                    this.prisma.appointment.findFirst({
                        where: { patientId, scheduledAt: { not: null } },
                        orderBy: { scheduledAt: 'desc' },
                        select: { scheduledAt: true },
                    }),
                    this.prisma.labResult.findFirst({
                        where: { labOrder: { appointment: { patientId } } },
                        orderBy: { uploadedAt: 'desc' },
                        select: { uploadedAt: true },
                    }),
                    this.prisma.prescription.findFirst({
                        where: { appointment: { patientId } },
                        orderBy: { createdAt: 'desc' },
                        select: { createdAt: true },
                    }),
                ]);
                historyByPatient.set(patientId, {
                    appointmentCount,
                    labOrderCount,
                    prescriptionCount,
                    latestAppointmentAt: latestAppointment?.scheduledAt ?? null,
                    latestLabResultAt: latestLab?.uploadedAt ?? null,
                    latestPrescriptionAt: latestPrescription?.createdAt ?? null,
                });
            }));
            return appointments.map(({ patient, ...appointment }) => ({
                ...appointment,
                patientSnapshot: {
                    id: patient.id,
                    fullName: patient.fullName,
                    email: patient.email,
                    profile: patient.patientProfile,
                },
                patientHistorySummary: historyByPatient.get(appointment.patientId) ?? {
                    appointmentCount: 0,
                    labOrderCount: 0,
                    prescriptionCount: 0,
                    latestAppointmentAt: null,
                    latestLabResultAt: null,
                    latestPrescriptionAt: null,
                },
            }));
        }
        throw new common_1.ForbiddenException('Only doctor and patient roles can view appointments');
    }
    async confirmByDoctor(doctorId, appointmentId) {
        const appointment = await this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.CONFIRMED);
        await this.auditService.record(doctorId, 'APPOINTMENT_CONFIRMED', 'Appointment', appointment.id);
        return appointment;
    }
    async scheduleByDoctor(doctorId, appointmentId, scheduledAt) {
        const appointment = await this.getAppointmentOrThrow(appointmentId);
        this.assertDoctorOwnership(appointment.doctorId, doctorId);
        if (appointment.status !== client_1.AppointmentStatus.REQUESTED) {
            throw new common_1.BadRequestException('Only REQUESTED appointments can be scheduled');
        }
        const scheduledDate = new Date(scheduledAt);
        if (Number.isNaN(scheduledDate.getTime())) {
            throw new common_1.BadRequestException('scheduledAt must be a valid ISO date');
        }
        const updated = await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                scheduledAt: scheduledDate,
                status: client_1.AppointmentStatus.CONFIRMED,
            },
        });
        await this.notificationsService.createAndEmit(updated.patientId, client_1.NotificationType.APPOINTMENT_CALLED, `Your appointment has been scheduled for ${scheduledDate.toLocaleString()}.`, { appointmentId: updated.id, scheduledAt: updated.scheduledAt }, doctorId);
        await this.auditService.record(doctorId, 'APPOINTMENT_SCHEDULED', 'Appointment', updated.id, {
            scheduledAt: updated.scheduledAt,
        });
        return updated;
    }
    async callByDoctor(doctorId, appointmentId) {
        const appointment = await this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.CALLED);
        await this.notificationsService.createAndEmit(appointment.patientId, client_1.NotificationType.APPOINTMENT_CALLED, 'Your appointment has been called by the doctor.', { appointmentId: appointment.id }, doctorId);
        await this.auditService.record(doctorId, 'APPOINTMENT_CALLED', 'Appointment', appointment.id);
        return appointment;
    }
    async markInVisitByDoctor(doctorId, appointmentId) {
        const appointment = await this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.IN_VISIT);
        await this.auditService.record(doctorId, 'APPOINTMENT_IN_VISIT', 'Appointment', appointment.id);
        return appointment;
    }
    async markExamDoneByDoctor(doctorId, appointmentId) {
        const appointment = await this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.EXAM_DONE);
        await this.auditService.record(doctorId, 'APPOINTMENT_EXAM_DONE', 'Appointment', appointment.id);
        return appointment;
    }
    async closeByDoctor(doctorId, appointmentId) {
        const appointment = await this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.CLOSED);
        await this.auditService.record(doctorId, 'APPOINTMENT_CLOSED', 'Appointment', appointment.id);
        return appointment;
    }
    async cancelByDoctor(doctorId, appointmentId) {
        const appointment = await this.getAppointmentOrThrow(appointmentId);
        this.assertDoctorOwnership(appointment.doctorId, doctorId);
        const doctorCancellable = [
            client_1.AppointmentStatus.REQUESTED,
            client_1.AppointmentStatus.CONFIRMED,
            client_1.AppointmentStatus.CALLED,
            client_1.AppointmentStatus.IN_VISIT,
        ];
        if (!doctorCancellable.includes(appointment.status)) {
            throw new common_1.BadRequestException('Doctor can cancel only REQUESTED, CONFIRMED, CALLED, or IN_VISIT appointments');
        }
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
        await this.auditService.record(doctorId, 'APPOINTMENT_CANCELLED_BY_DOCTOR', 'Appointment', updatedAppointment.id);
        return updatedAppointment;
    }
    async cancelByPatient(patientId, appointmentId) {
        const appointment = await this.getAppointmentOrThrow(appointmentId);
        if (appointment.patientId !== patientId) {
            throw new common_1.ForbiddenException('You can only cancel your own appointments');
        }
        const patientCancellable = [
            client_1.AppointmentStatus.REQUESTED,
            client_1.AppointmentStatus.CONFIRMED,
        ];
        if (!patientCancellable.includes(appointment.status)) {
            throw new common_1.BadRequestException('Patient can cancel only REQUESTED or CONFIRMED appointments');
        }
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
        await this.auditService.record(patientId, 'APPOINTMENT_CANCELLED_BY_PATIENT', 'Appointment', updatedAppointment.id);
        return updatedAppointment;
    }
    async updateByDoctorTransition(doctorId, appointmentId, nextStatus) {
        const appointment = await this.getAppointmentOrThrow(appointmentId);
        this.assertDoctorOwnership(appointment.doctorId, doctorId);
        this.transitionOrThrow(appointment.status, nextStatus);
        await this.assertCloseAllowed(appointment, nextStatus);
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: nextStatus },
        });
    }
    async getAppointmentOrThrow(appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    assertDoctorOwnership(doctorIdInAppointment, doctorId) {
        if (doctorIdInAppointment !== doctorId) {
            throw new common_1.ForbiddenException('You can only modify your own appointments');
        }
    }
    transitionOrThrow(current, next) {
        if (!TRANSITIONS[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid transition: ${current} -> ${next}`);
        }
    }
    async assertCloseAllowed(appointment, nextStatus) {
        if (nextStatus !== client_1.AppointmentStatus.CLOSED) {
            return;
        }
        const requiresLab = Boolean(appointment.requiresLab);
        const labFlowLocked = Boolean(appointment.labFlowLocked);
        if (!requiresLab) {
            return;
        }
        if (labFlowLocked) {
            throw new common_1.BadRequestException('Cannot close appointment while lab workflow is pending result upload');
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
            throw new common_1.BadRequestException('Cannot close appointment before lab result is uploaded');
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        audit_service_1.AuditService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map