import { PrismaService } from '../prisma/prisma.service';
import { UpdatePharmacyMyProfileDto } from './dto/update-my-profile.dto';
export declare class PharmaciesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getPharmacyProfile;
    getMyProfile(pharmacyId: string): Promise<{
        pharmacy: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "PHARMACY";
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
    getProfileForAdmin(pharmacyId: string): Promise<{
        pharmacy: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "PHARMACY";
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
    private updatePharmacyProfile;
    updateMyProfile(pharmacyId: string, dto: UpdatePharmacyMyProfileDto): Promise<{
        pharmacy: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "PHARMACY";
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
    updateProfileForAdmin(pharmacyId: string, dto: UpdatePharmacyMyProfileDto): Promise<{
        pharmacy: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "PHARMACY";
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
