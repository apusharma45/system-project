"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_email_service_1 = require("./auth-email.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    static { AuthService_1 = this; }
    prisma;
    usersService;
    authEmailService;
    jwtService;
    static RESET_CODE_EXPIRES_MINUTES = 10;
    static RESET_CODE_MAX_ATTEMPTS = 5;
    constructor(prisma, usersService, authEmailService, jwtService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.authEmailService = authEmailService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Email already in use');
        }
        this.assertRequiredRoleFields(dto);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const patientProfile = dto.role === 'PATIENT'
            ? {
                gender: dto.patientProfile.gender,
                dateOfBirth: new Date(dto.patientProfile.dateOfBirth),
                allergies: dto.patientProfile?.allergies,
                chronicConditions: dto.patientProfile?.chronicConditions,
                currentMedications: dto.patientProfile?.currentMedications,
                emergencyContactName: dto.patientProfile?.emergencyContactName,
                emergencyContactPhone: dto.patientProfile?.emergencyContactPhone,
                emergencyContactRelation: dto.patientProfile?.emergencyContactRelation,
            }
            : undefined;
        const professionalProfile = dto.role === 'DOCTOR' || dto.role === 'PHARMACY' || dto.role === 'DIAGNOSTIC'
            ? {
                gender: dto.professionalProfile?.gender,
                dateOfBirth: dto.professionalProfile?.dateOfBirth
                    ? new Date(dto.professionalProfile.dateOfBirth)
                    : undefined,
                licenseNumber: dto.professionalProfile?.licenseNumber,
                specialization: dto.professionalProfile?.specialization,
                pharmacyName: dto.professionalProfile?.pharmacyName,
                labName: dto.professionalProfile?.labName,
                degrees: dto.professionalProfile?.degrees,
                certifications: dto.professionalProfile?.certifications,
                yearsOfExperience: dto.professionalProfile?.yearsOfExperience,
                licenseAuthority: dto.professionalProfile?.licenseAuthority,
                accreditations: dto.professionalProfile?.accreditations,
                availableTests: dto.professionalProfile?.availableTests,
            }
            : undefined;
        const user = await this.usersService.createUser({
            fullName: dto.fullName,
            email: dto.email,
            passwordHash,
            role: dto.role,
            phone: dto.phone,
            address: dto.address,
            patientProfile,
            professionalProfile,
        });
        return this.signToken(user.id, user.email, user.role);
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
        if (!validPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.signToken(user.id, user.email, user.role);
    }
    async requestPasswordReset(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return {
                message: 'If the email exists, a reset code has been sent.',
            };
        }
        const code = (0, crypto_1.randomInt)(0, 1000000).toString().padStart(6, '0');
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + AuthService_1.RESET_CODE_EXPIRES_MINUTES * 60 * 1000);
        await this.prisma.passwordResetCode.create({
            data: {
                userId: user.id,
                email,
                codeHash,
                expiresAt,
            },
        });
        await this.authEmailService.sendPasswordResetCode({
            toEmail: email,
            fullName: user.fullName,
            code,
        });
        return {
            message: 'If the email exists, a reset code has been sent.',
        };
    }
    async resetPassword(dto) {
        const email = dto.email.trim().toLowerCase();
        const resetCodeRecord = await this.prisma.passwordResetCode.findFirst({
            where: {
                email,
                consumedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!resetCodeRecord) {
            throw new common_1.UnauthorizedException('Invalid or expired reset code');
        }
        if (resetCodeRecord.attemptCount >= AuthService_1.RESET_CODE_MAX_ATTEMPTS) {
            throw new common_1.UnauthorizedException('Too many invalid attempts. Request a new reset code');
        }
        const validCode = await bcrypt.compare(dto.resetCode, resetCodeRecord.codeHash);
        if (!validCode) {
            await this.prisma.passwordResetCode.update({
                where: { id: resetCodeRecord.id },
                data: { attemptCount: { increment: 1 } },
            });
            throw new common_1.UnauthorizedException('Invalid or expired reset code');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        const updatedCount = await this.prisma.user.updateMany({
            where: { email },
            data: { passwordHash },
        });
        if (updatedCount.count === 0) {
            throw new common_1.UnauthorizedException('Invalid or expired reset code');
        }
        await this.prisma.passwordResetCode.update({
            where: { id: resetCodeRecord.id },
            data: { consumedAt: new Date() },
        });
        await this.prisma.passwordResetCode.deleteMany({
            where: {
                email,
                consumedAt: null,
            },
        });
        return {
            message: 'Password reset successful',
        };
    }
    async signToken(userId, email, role) {
        return {
            access_token: await this.jwtService.signAsync({
                sub: userId,
                email,
                role,
            }),
        };
    }
    assertRequiredRoleFields(dto) {
        if (dto.role === 'PATIENT') {
            if (!dto.patientProfile) {
                throw new common_1.BadRequestException('patientProfile is required for PATIENT registration');
            }
            const patientProfile = dto.patientProfile;
            if (!patientProfile.gender) {
                throw new common_1.BadRequestException('patientProfile.gender is required for PATIENT registration');
            }
            if (!patientProfile.dateOfBirth) {
                throw new common_1.BadRequestException('patientProfile.dateOfBirth is required for PATIENT registration');
            }
            return;
        }
        if (dto.role === 'DOCTOR') {
            if (!dto.professionalProfile) {
                throw new common_1.BadRequestException('professionalProfile is required for DOCTOR registration');
            }
            const professionalProfile = dto.professionalProfile;
            if (!professionalProfile.gender) {
                throw new common_1.BadRequestException('professionalProfile.gender is required for DOCTOR registration');
            }
            if (!professionalProfile.dateOfBirth) {
                throw new common_1.BadRequestException('professionalProfile.dateOfBirth is required for DOCTOR registration');
            }
            if (!professionalProfile.licenseNumber) {
                throw new common_1.BadRequestException('professionalProfile.licenseNumber is required for DOCTOR registration');
            }
            if (!professionalProfile.specialization) {
                throw new common_1.BadRequestException('professionalProfile.specialization is required for DOCTOR registration');
            }
            return;
        }
        if (dto.role === 'PHARMACY') {
            if (!dto.professionalProfile) {
                throw new common_1.BadRequestException('professionalProfile is required for PHARMACY registration');
            }
            const professionalProfile = dto.professionalProfile;
            if (!professionalProfile.licenseNumber) {
                throw new common_1.BadRequestException('professionalProfile.licenseNumber is required for PHARMACY registration');
            }
            if (!professionalProfile.pharmacyName) {
                throw new common_1.BadRequestException('professionalProfile.pharmacyName is required for PHARMACY registration');
            }
            return;
        }
        if (dto.role === 'DIAGNOSTIC') {
            if (!dto.professionalProfile) {
                throw new common_1.BadRequestException('professionalProfile is required for DIAGNOSTIC registration');
            }
            const professionalProfile = dto.professionalProfile;
            if (!professionalProfile.licenseNumber) {
                throw new common_1.BadRequestException('professionalProfile.licenseNumber is required for DIAGNOSTIC registration');
            }
            if (!professionalProfile.labName) {
                throw new common_1.BadRequestException('professionalProfile.labName is required for DIAGNOSTIC registration');
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        auth_email_service_1.AuthEmailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map