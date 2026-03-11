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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyProfile(patientId) {
        const patient = await this.prisma.user.findUnique({
            where: { id: patientId },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true,
                patientProfile: true,
            },
        });
        if (!patient || patient.role !== client_1.Role.PATIENT) {
            throw new common_1.NotFoundException('Patient not found');
        }
        return {
            patient: {
                id: patient.id,
                fullName: patient.fullName,
                email: patient.email,
                role: patient.role,
                phone: patient.phone,
                address: patient.address,
                joinedAt: patient.createdAt,
                profile: patient.patientProfile,
            },
        };
    }
    async updateMyProfile(patientId, dto) {
        const patient = await this.prisma.user.findUnique({
            where: { id: patientId },
            select: { id: true, role: true },
        });
        if (!patient || patient.role !== client_1.Role.PATIENT) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const profileUpdateData = {};
        if (dto.allergies !== undefined)
            profileUpdateData.allergies = dto.allergies;
        if (dto.chronicConditions !== undefined)
            profileUpdateData.chronicConditions = dto.chronicConditions;
        if (dto.currentMedications !== undefined)
            profileUpdateData.currentMedications = dto.currentMedications;
        if (dto.emergencyContactName !== undefined)
            profileUpdateData.emergencyContactName = dto.emergencyContactName;
        if (dto.emergencyContactPhone !== undefined)
            profileUpdateData.emergencyContactPhone = dto.emergencyContactPhone;
        if (dto.emergencyContactRelation !== undefined)
            profileUpdateData.emergencyContactRelation = dto.emergencyContactRelation;
        await this.prisma.user.update({
            where: { id: patientId },
            data: {
                fullName: dto.fullName,
                phone: dto.phone,
                address: dto.address,
                patientProfile: Object.keys(profileUpdateData).length > 0
                    ? {
                        upsert: {
                            create: profileUpdateData,
                            update: profileUpdateData,
                        },
                    }
                    : undefined,
            },
        });
        return this.getMyProfile(patientId);
    }
    async getProfileForDoctor(doctorId, patientId) {
        const canAccess = await this.prisma.appointment.findFirst({
            where: {
                doctorId,
                patientId,
            },
            select: { id: true },
        });
        if (!canAccess) {
            throw new common_1.ForbiddenException('You are not allowed to view this patient profile');
        }
        const patient = await this.prisma.user.findUnique({
            where: { id: patientId },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
                patientProfile: true,
            },
        });
        if (!patient || patient.role !== client_1.Role.PATIENT) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const db = this.prisma;
        const [appointments, labOrders, prescriptions] = await Promise.all([
            this.prisma.appointment.findMany({
                where: { patientId },
                orderBy: { createdAt: 'desc' },
            }),
            db.labOrder.findMany({
                where: {
                    appointment: {
                        patientId,
                    },
                },
                include: {
                    appointment: true,
                    labReports: { orderBy: { uploadedAt: 'desc' } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            db.prescription.findMany({
                where: {
                    appointment: {
                        patientId,
                    },
                },
                include: {
                    appointment: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            patient: {
                id: patient.id,
                fullName: patient.fullName,
                email: patient.email,
                joinedAt: patient.createdAt,
                profile: patient.patientProfile,
            },
            summary: {
                appointmentCount: appointments.length,
                labOrderCount: labOrders.length,
                prescriptionCount: prescriptions.length,
            },
            history: {
                appointments,
                labOrders: labOrders.map((item) => ({
                    ...item,
                    latestReport: item.labReports?.[0] ?? null,
                    labResult: item.labReports?.[0] ?? null,
                })),
                prescriptions,
            },
        };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map