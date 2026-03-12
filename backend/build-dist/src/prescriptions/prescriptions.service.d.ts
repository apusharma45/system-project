import { Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionNotesDto } from './dto/update-prescription-notes.dto';
type UploadedPrescriptionFile = {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
};
export declare class PrescriptionsService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly auditService;
    private readonly cloudinaryService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, auditService: AuditService, cloudinaryService: CloudinaryService);
    createDraft(doctorId: string, dto: CreatePrescriptionDto): Promise<any>;
    signByDoctor(doctorId: string, prescriptionId: string, dto?: UpdatePrescriptionNotesDto): Promise<any>;
    sendToPatientByDoctor(doctorId: string, prescriptionId: string): Promise<any>;
    sendToPharmacyByDoctor(doctorId: string, prescriptionId: string): Promise<any>;
    dispenseByPharmacy(pharmacyId: string, prescriptionId: string): Promise<any>;
    uploadDocumentByDoctor(doctorId: string, prescriptionId: string, file: UploadedPrescriptionFile | undefined): Promise<any>;
    listMine(userId: string, role: Role): any;
    getOne(userId: string, role: Role, prescriptionId: string): Promise<any>;
    private getPrescriptionWithAppointmentOrThrow;
    private assertDoctorOwnership;
    private transitionOrThrow;
    private assertLabDependencySatisfied;
    private withPharmacySnapshot;
    private getPharmacySnapshot;
}
export {};
