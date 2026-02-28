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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    record(actorUserId, action, entityType, entityId, metadata) {
        const db = this.prisma;
        return db.auditLog.create({
            data: {
                actorUserId,
                action,
                entityType,
                entityId,
                ...(metadata ? { metadata } : {}),
            },
        });
    }
    listForAdmin(query) {
        const db = this.prisma;
        return db.auditLog.findMany({
            where: this.buildWhere(query),
            orderBy: { createdAt: 'desc' },
            take: query.limit ?? 50,
        });
    }
    listMine(userId, query) {
        const db = this.prisma;
        return db.auditLog.findMany({
            where: {
                ...this.buildWhere(query),
                actorUserId: userId,
            },
            orderBy: { createdAt: 'desc' },
            take: query.limit ?? 50,
        });
    }
    listByEntity(entityType, entityId, query) {
        const db = this.prisma;
        return db.auditLog.findMany({
            where: {
                ...this.buildWhere(query),
                entityType,
                entityId,
            },
            orderBy: { createdAt: 'desc' },
            take: query.limit ?? 50,
        });
    }
    buildWhere(query) {
        const where = {};
        if (query.entityType)
            where.entityType = query.entityType;
        if (query.entityId)
            where.entityId = query.entityId;
        if (query.actorUserId)
            where.actorUserId = query.actorUserId;
        if (query.from || query.to) {
            where.createdAt = {
                ...(query.from ? { gte: new Date(query.from) } : {}),
                ...(query.to ? { lte: new Date(query.to) } : {}),
            };
        }
        return where;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map