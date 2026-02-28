import { Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UploadLabResultDto } from './dto/upload-lab-result.dto';
export declare class LabsService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly auditService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, auditService: AuditService);
    createOrder(doctorId: string, dto: CreateLabOrderDto): Promise<any>;
    assignOrder(diagnosticId: string, orderId: string): Promise<any>;
    collectSample(diagnosticId: string, orderId: string): Promise<any>;
    uploadResult(diagnosticId: string, orderId: string, dto: UploadLabResultDto): Promise<any>;
    markSent(diagnosticId: string, orderId: string): Promise<any>;
    listMine(userId: string, role: Role): any;
    getResult(userId: string, role: Role, orderId: string): Promise<any>;
    private updateByDiagnosticTransition;
    private getOrderOrThrow;
    private assertDiagnosticOwnership;
    private transitionOrThrow;
}
