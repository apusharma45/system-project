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
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    static { UsersService_1 = this; }
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    static REGISTER_SELECT = {
        id: true,
        email: true,
        role: true,
    };
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map