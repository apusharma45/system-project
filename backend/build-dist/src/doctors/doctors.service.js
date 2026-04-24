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
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DoctorsService = class DoctorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDoctorProfile(doctorId) {
        const doctor = await this.prisma.user.findUnique({
            where: { id: doctorId },
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true,
                professionalProfile: true,
            },
        });
        if (!doctor || doctor.role !== client_1.Role.DOCTOR) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        return {
            doctor: {
                id: doctor.id,
                fullName: doctor.fullName,
                avatarUrl: doctor.avatarUrl,
                email: doctor.email,
                role: doctor.role,
                phone: doctor.phone,
                address: doctor.address,
                joinedAt: doctor.createdAt,
                profile: doctor.professionalProfile,
            },
        };
    }
    async getMyProfile(doctorId) {
        return this.getDoctorProfile(doctorId);
    }
    async getProfileForAdmin(doctorId) {
        return this.getDoctorProfile(doctorId);
    }
    buildProfileData(dto) {
        return {
            ...(dto.licenseNumber !== undefined ? { licenseNumber: dto.licenseNumber } : {}),
            ...(dto.specialization !== undefined ? { specialization: dto.specialization } : {}),
            ...(dto.dateOfBirth !== undefined
                ? { dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null }
                : {}),
            ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
            ...(dto.about !== undefined ? { about: dto.about } : {}),
            ...(dto.clinicName !== undefined ? { clinicName: dto.clinicName } : {}),
            ...(dto.clinicAddress !== undefined ? { clinicAddress: dto.clinicAddress } : {}),
            ...(dto.clinicPhone !== undefined ? { clinicPhone: dto.clinicPhone } : {}),
            ...(dto.degrees !== undefined
                ? { degrees: dto.degrees }
                : {}),
            ...(dto.certifications !== undefined
                ? { certifications: dto.certifications }
                : {}),
            ...(dto.yearsOfExperience !== undefined ? { yearsOfExperience: dto.yearsOfExperience } : {}),
            ...(dto.availableTimeSlots !== undefined
                ? {
                    availableTimeSlots: dto.availableTimeSlots.map((slot) => ({
                        day: slot.day,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                    })),
                }
                : {}),
        };
    }
    async updateDoctorProfile(doctorId, dto) {
        const doctor = await this.prisma.user.findUnique({
            where: { id: doctorId },
            select: { id: true, role: true },
        });
        if (!doctor || doctor.role !== client_1.Role.DOCTOR) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const profileData = this.buildProfileData(dto);
        const hasProfileData = Object.keys(profileData).length > 0;
        await this.prisma.user.update({
            where: { id: doctorId },
            data: {
                fullName: dto.fullName,
                phone: dto.phone,
                address: dto.address,
                ...(hasProfileData
                    ? {
                        professionalProfile: {
                            upsert: {
                                create: profileData,
                                update: profileData,
                            },
                        },
                    }
                    : {}),
            },
        });
        return this.getDoctorProfile(doctorId);
    }
    async updateMyProfile(doctorId, dto) {
        return this.updateDoctorProfile(doctorId, dto);
    }
    async updateProfileForAdmin(doctorId, dto) {
        return this.updateDoctorProfile(doctorId, dto);
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map