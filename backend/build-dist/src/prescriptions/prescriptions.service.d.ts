import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionNotesDto } from './dto/update-prescription-notes.dto';
export declare class PrescriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createDraft(doctorId: string, dto: CreatePrescriptionDto): Promise<any>;
    signByDoctor(doctorId: string, prescriptionId: string, dto?: UpdatePrescriptionNotesDto): Promise<any>;
    sendToPatientByDoctor(doctorId: string, prescriptionId: string): Promise<any>;
    sendToPharmacyByDoctor(doctorId: string, prescriptionId: string): Promise<any>;
    dispenseByPharmacy(pharmacyId: string, prescriptionId: string): Promise<any>;
    listMine(userId: string, role: Role): any;
    getOne(userId: string, role: Role, prescriptionId: string): Promise<any>;
    private updateByDoctorTransition;
    private getPrescriptionWithAppointmentOrThrow;
    private assertDoctorOwnership;
    private transitionOrThrow;
    private assertLabDependencySatisfied;
}
