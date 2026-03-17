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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    static { UsersService_1 = this; }
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    static REGISTER_SELECT = {
        id: true,
        email: true,
        role: true,
        avatarUrl: true,
    };
    static ALLOWED_AVATAR_MIME_TYPES = new Set([
        'image/jpeg',
        'image/png',
        'image/webp',
    ]);
    static MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
    findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async uploadMyAvatar(userId, file) {
        if (!file) {
            throw new common_1.BadRequestException('Avatar file is required');
        }
        if (!UsersService_1.ALLOWED_AVATAR_MIME_TYPES.has(file.mimetype)) {
            throw new common_1.BadRequestException('Only jpg, png, and webp images are allowed');
        }
        if (file.size > UsersService_1.MAX_AVATAR_SIZE_BYTES) {
            throw new common_1.BadRequestException('Avatar image must be 5MB or smaller');
        }
        const existing = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                avatarPublicId: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        const upload = await this.cloudinaryService.uploadBuffer({
            buffer: file.buffer,
            fileName: file.originalname,
            folder: `profile-avatars/${userId}`,
            contentType: file.mimetype,
            resourceType: 'image',
        });
        if (existing.avatarPublicId) {
            await this.cloudinaryService.destroy(existing.avatarPublicId, 'image');
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl: upload.url,
                avatarPublicId: upload.publicId,
                avatarMimeType: upload.mimeType,
                avatarSizeBytes: upload.bytes,
            },
            select: {
                id: true,
                avatarUrl: true,
            },
        });
        return {
            user: updated,
        };
    }
    async removeMyAvatar(userId) {
        const existing = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                avatarPublicId: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        if (existing.avatarPublicId) {
            await this.cloudinaryService.destroy(existing.avatarPublicId, 'image');
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl: null,
                avatarPublicId: null,
                avatarMimeType: null,
                avatarSizeBytes: null,
            },
            select: {
                id: true,
                avatarUrl: true,
            },
        });
        return {
            user: updated,
        };
    }
    createUser(params) {
        const { fullName, email, passwordHash, role, phone, address, patientProfile, professionalProfile, } = params;
        return this.prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash,
                role,
                phone,
                address,
                patientProfile: patientProfile ? { create: patientProfile } : undefined,
                professionalProfile: professionalProfile ? { create: professionalProfile } : undefined,
            },
            select: UsersService_1.REGISTER_SELECT,
        });
    }
    listByRole(role) {
        return this.prisma.user.findMany({
            where: { role },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    listDoctorsForPatients() {
        return this.prisma.user.findMany({
            where: { role: client_1.Role.DOCTOR },
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                email: true,
                role: true,
                professionalProfile: {
                    select: {
                        specialization: true,
                        yearsOfExperience: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }).then((items) => items.map((item) => ({
            id: item.id,
            fullName: item.fullName,
            avatarUrl: item.avatarUrl,
            email: item.email,
            role: item.role,
            specialization: item.professionalProfile?.specialization ?? null,
            yearsOfExperience: item.professionalProfile?.yearsOfExperience ?? null,
        })));
    }
    async getDoctorDetailsForPatients(doctorId) {
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
                professionalProfile: {
                    select: {
                        specialization: true,
                        yearsOfExperience: true,
                        degrees: true,
                        about: true,
                        clinicName: true,
                        clinicAddress: true,
                        clinicPhone: true,
                        availableTimeSlots: true,
                    },
                },
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
                specialization: doctor.professionalProfile?.specialization ?? null,
                yearsOfExperience: doctor.professionalProfile?.yearsOfExperience ?? null,
                degrees: doctor.professionalProfile?.degrees ?? null,
                about: doctor.professionalProfile?.about ?? null,
                clinicName: doctor.professionalProfile?.clinicName ?? null,
                clinicAddress: doctor.professionalProfile?.clinicAddress ?? null,
                clinicPhone: doctor.professionalProfile?.clinicPhone ?? null,
                availableTimeSlots: doctor.professionalProfile?.availableTimeSlots ?? null,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], UsersService);
//# sourceMappingURL=users.service.js.map