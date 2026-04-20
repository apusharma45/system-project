import { PrismaService } from '../prisma/prisma.service';
import { UpdateDoctorMyProfileDto } from './dto/update-my-profile.dto';
export declare class DoctorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyProfile(doctorId: string): Promise<{
        doctor: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "DOCTOR";
            phone: string | null;
            address: string | null;
            joinedAt: Date;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                licenseNumber: string | null;
                specialization: string | null;
                about: string | null;
                clinicName: string | null;
                clinicAddress: string | null;
                clinicPhone: string | null;
                availableTimeSlots: import("@prisma/client/runtime/client").JsonValue | null;
                pharmacyName: string | null;
                labName: string | null;
                degrees: import("@prisma/client/runtime/client").JsonValue | null;
                certifications: import("@prisma/client/runtime/client").JsonValue | null;
                yearsOfExperience: number | null;
                licenseAuthority: string | null;
                accreditations: import("@prisma/client/runtime/client").JsonValue | null;
                availableTests: import("@prisma/client/runtime/client").JsonValue | null;
            } | null;
        };
    }>;
    updateMyProfile(doctorId: string, dto: UpdateDoctorMyProfileDto): Promise<{
        doctor: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "DOCTOR";
            phone: string | null;
            address: string | null;
            joinedAt: Date;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                dateOfBirth: Date | null;
                gender: string | null;
                licenseNumber: string | null;
                specialization: string | null;
                about: string | null;
                clinicName: string | null;
                clinicAddress: string | null;
                clinicPhone: string | null;
                availableTimeSlots: import("@prisma/client/runtime/client").JsonValue | null;
                pharmacyName: string | null;
                labName: string | null;
                degrees: import("@prisma/client/runtime/client").JsonValue | null;
                certifications: import("@prisma/client/runtime/client").JsonValue | null;
                yearsOfExperience: number | null;
                licenseAuthority: string | null;
                accreditations: import("@prisma/client/runtime/client").JsonValue | null;
                availableTests: import("@prisma/client/runtime/client").JsonValue | null;
            } | null;
        };
    }>;
}
