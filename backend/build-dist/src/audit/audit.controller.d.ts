import { AuditQueryDto } from './dto/audit-query.dto';
import { AuditService } from './audit.service';
type RequestUser = {
    userId: string;
};
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    listForAdmin(query: AuditQueryDto): any;
    listMine(req: {
        user: RequestUser;
    }, query: AuditQueryDto): any;
    listByEntity(entityType: string, entityId: string, query: AuditQueryDto): any;
}
export {};
