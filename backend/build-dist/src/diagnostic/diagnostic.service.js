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
exports.DiagnosticService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DiagnosticService = class DiagnosticService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyProfile(diagnosticId) {
        const diagnostic = await this.prisma.user.findUnique({
            where: { id: diagnosticId },
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
        if (!diagnostic || diagnostic.role !== client_1.Role.DIAGNOSTIC) {
            throw new common_1.NotFoundException('Diagnostic user not found');
        }
        return {
            diagnostic: {
                id: diagnostic.id,
                fullName: diagnostic.fullName,
                avatarUrl: diagnostic.avatarUrl,
                email: diagnostic.email,
                role: diagnostic.role,
                phone: diagnostic.phone,
                address: diagnostic.address,
                joinedAt: diagnostic.createdAt,
                profile: diagnostic.professionalProfile,
            },
        };
    }
    async updateMyProfile(diagnosticId, dto) {
        const diagnostic = await this.prisma.user.findUnique({
            where: { id: diagnosticId },
            select: { id: true, role: true },
        });
        if (!diagnostic || diagnostic.role !== client_1.Role.DIAGNOSTIC) {
            throw new common_1.NotFoundException('Diagnostic user not found');
        }
        await this.prisma.user.update({
            where: { id: diagnosticId },
            data: {
                fullName: dto.fullName,
                phone: dto.phone,
                address: dto.address,
            },
        });
        return this.getMyProfile(diagnosticId);
    }
};
exports.DiagnosticService = DiagnosticService;
exports.DiagnosticService = DiagnosticService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiagnosticService);
//# sourceMappingURL=diagnostic.service.js.map