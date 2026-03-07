import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { PatientsService } from './patients.service';
type RequestUser = {
    userId: string;
};
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    getMyProfile(req: {
        user: RequestUser;
    }): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            email: string;
            role: "PATIENT";
            phone: string | null;
            address: string | null;
            joinedAt: Date;
            profile: {
                id: string;
                phone: string | null;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
                patientId: string;
            } | null;
        };
    }>;
    updateMyProfile(req: {
        user: RequestUser;
    }, dto: UpdateMyProfileDto): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            email: string;
            role: "PATIENT";
            phone: string | null;
            address: string | null;
            joinedAt: Date;
            profile: {
                id: string;
                phone: string | null;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
                patientId: string;
            } | null;
        };
    }>;
    getProfile(req: {
        user: RequestUser;
    }, patientId: string): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            email: string;
            joinedAt: Date;
            profile: {
                id: string;
                phone: string | null;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
                patientId: string;
            } | null;
        };
        summary: {
            appointmentCount: number;
            labOrderCount: any;
            prescriptionCount: any;
        };
        history: {
            appointments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                preferredDateFrom: Date | null;
                preferredDateTo: Date | null;
                reason: string | null;
                preferredTimeNote: string | null;
                scheduledAt: Date | null;
                status: import("../../generated/prisma/enums").AppointmentStatus;
                requiresLab: boolean;
                labFlowLocked: boolean;
                patientId: string;
            }[];
            labOrders: any;
            prescriptions: any;
        };
    }>;
}
export {};
