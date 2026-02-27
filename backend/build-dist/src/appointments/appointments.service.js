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
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForPatient(patientId, dto) {
        const doctor = await this.prisma.user.findUnique({
            where: { id: dto.doctorId },
            select: { id: true, role: true },
        });
        if (!doctor || doctor.role !== client_1.Role.DOCTOR) {
            throw new common_1.BadRequestException('doctorId must belong to a doctor');
        }
        return this.prisma.appointment.create({
            data: {
                patientId,
                doctorId: dto.doctorId,
                scheduledAt: new Date(dto.scheduledAt),
            },
        });
    }
    listMine(userId, role) {
        if (role === client_1.Role.PATIENT) {
            return this.prisma.appointment.findMany({
                where: { patientId: userId },
                orderBy: { scheduledAt: 'asc' },
            });
        }
        if (role === client_1.Role.DOCTOR) {
            return this.prisma.appointment.findMany({
                where: { doctorId: userId },
                orderBy: { scheduledAt: 'asc' },
            });
        }
        throw new common_1.ForbiddenException('Only doctor and patient roles can view appointments');
    }
    async confirmByDoctor(doctorId, appointmentId) {
        return this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.CONFIRMED);
    }
    async callByDoctor(doctorId, appointmentId) {
        return this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.CALLED);
    }
    async markInVisitByDoctor(doctorId, appointmentId) {
        return this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.IN_VISIT);
    }
    async markExamDoneByDoctor(doctorId, appointmentId) {
        return this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.EXAM_DONE);
    }
    async closeByDoctor(doctorId, appointmentId) {
        return this.updateByDoctorTransition(doctorId, appointmentId, client_1.AppointmentStatus.CLOSED);
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
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
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
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map