import { PrismaService } from '../prisma/prisma.service';
export declare class PatientsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfileForDoctor(doctorId: string, patientId: string): Promise<{
        patient: {
            id: string;
            fullName: string | null;
            email: string;
            joinedAt: Date;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                phone: string | null;
                address: string | null;
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
