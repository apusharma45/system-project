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
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.ForbiddenException('You can only confirm your own appointments');
        }
        if (appointment.status !== client_1.AppointmentStatus.REQUESTED) {
            throw new common_1.BadRequestException('Only REQUESTED appointments can be confirmed');
        }
        return this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CONFIRMED },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map