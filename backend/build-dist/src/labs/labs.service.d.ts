import { Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
type UploadedLabFile = {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
};
type StoredLabReport = {
    id: string;
    labOrderId: string;
    fileUrl: string;
    filePublicId?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    uploadedAt: Date;
};
export declare class LabsService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly auditService;
    private readonly cloudinaryService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, auditService: AuditService, cloudinaryService: CloudinaryService);
    createOrder(doctorId: string, dto: CreateLabOrderDto): Promise<any>;
    assignOrder(diagnosticId: string, orderId: string): Promise<any>;
    collectSample(diagnosticId: string, orderId: string): Promise<any>;
    uploadResult(diagnosticId: string, orderId: string, files?: UploadedLabFile[]): Promise<{
        labOrderId: string;
        uploadedCount: number;
        reports: StoredLabReport[];
    }>;
    markSent(diagnosticId: string, orderId: string): Promise<any>;
    listMine(userId: string, role: Role): Promise<any>;
    getResult(userId: string, role: Role, orderId: string): Promise<any>;
    private uploadFileToCloudinary;
    private mapOrderOutput;
    private getAgeYears;
    private updateByDiagnosticTransition;
    private getOrderOrThrow;
    private assertDiagnosticOwnership;
    private transitionOrThrow;
}
export {};
