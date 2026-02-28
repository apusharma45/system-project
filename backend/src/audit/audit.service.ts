import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditQueryDto } from './dto/audit-query.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  record(
    actorUserId: string | null,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>,
  ) {
    const db = this.prisma as any;
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

  listForAdmin(query: AuditQueryDto) {
    const db = this.prisma as any;
    return db.auditLog.findMany({
      where: this.buildWhere(query),
      orderBy: { createdAt: 'desc' },
      take: query.limit ?? 50,
    });
  }

  listMine(userId: string, query: AuditQueryDto) {
    const db = this.prisma as any;
    return db.auditLog.findMany({
      where: {
        ...this.buildWhere(query),
        actorUserId: userId,
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit ?? 50,
    });
  }

  listByEntity(entityType: string, entityId: string, query: AuditQueryDto) {
    const db = this.prisma as any;
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

  private buildWhere(query: AuditQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = query.entityId;
    if (query.actorUserId) where.actorUserId = query.actorUserId;
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }
    return where;
  }
}
