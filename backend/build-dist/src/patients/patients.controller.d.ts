import { Role } from '../../generated/prisma/client';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { PatientsService } from './patients.service';
type RequestUser = {
    userId: string;
};
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    listPatients(): Promise<{
        id: string;
        fullName: string | null;
        avatarUrl: string | null;
        email: string;
        role: Role;
    }[]>;
    getMyProfile(req: {
        user: RequestUser;
    }): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
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
                patientId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
            } | null;
        };
    }>;
    updateMyProfile(req: {
        user: RequestUser;
    }, dto: UpdateMyProfileDto): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
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
                patientId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
            } | null;
        };
    }>;
    getProfileForAdmin(patientId: string): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
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
                patientId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
            } | null;
        };
    }>;
    updateProfileForAdmin(patientId: string, dto: UpdateMyProfileDto): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
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
                patientId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
            } | null;
        };
    }>;
    getProfile(req: {
        user: RequestUser;
    }, patientId: string): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            joinedAt: Date;
            profile: {
                id: string;
                phone: string | null;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                allergies: string | null;
                chronicConditions: string | null;
                currentMedications: string | null;
                emergencyContactName: string | null;
                emergencyContactPhone: string | null;
                emergencyContactRelation: string | null;
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
                patientId: string;
                doctorId: string;
                status: import("../../generated/prisma/enums").AppointmentStatus;
                scheduledAt: Date | null;
                reason: string | null;
                preferredDateFrom: Date | null;
                preferredDateTo: Date | null;
                preferredTimeNote: string | null;
                requiresLab: boolean;
                labFlowLocked: boolean;
            }[];
            labOrders: any;
            prescriptions: any;
        };
    }>;
}
export {};
