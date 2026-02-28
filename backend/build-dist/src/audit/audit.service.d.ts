import { PrismaService } from '../prisma/prisma.service';
import { AuditQueryDto } from './dto/audit-query.dto';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(actorUserId: string | null, action: string, entityType: string, entityId: string, metadata?: Record<string, unknown>): any;
    listForAdmin(query: AuditQueryDto): any;
    listMine(userId: string, query: AuditQueryDto): any;
    listByEntity(entityType: string, entityId: string, query: AuditQueryDto): any;
    private buildWhere;
}
