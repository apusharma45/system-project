import { PrismaService } from '../prisma/prisma.service';
import { UpdatePharmacyMyProfileDto } from './dto/update-my-profile.dto';
export declare class PharmaciesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
                labName: string | null;
                pharmacyName: string | null;
                gender: string | null;
                specialization: string | null;
                dateOfBirth: Date | null;
                licenseNumber: string | null;
                degrees: import("@prisma/client/runtime/client").JsonValue | null;
                certifications: import("@prisma/client/runtime/client").JsonValue | null;
                yearsOfExperience: number | null;
                licenseAuthority: string | null;
                accreditations: import("@prisma/client/runtime/client").JsonValue | null;
                availableTests: import("@prisma/client/runtime/client").JsonValue | null;
                userId: string;
            } | null;
        };
    }>;
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
                labName: string | null;
                pharmacyName: string | null;
                gender: string | null;
                specialization: string | null;
                dateOfBirth: Date | null;
                licenseNumber: string | null;
                degrees: import("@prisma/client/runtime/client").JsonValue | null;
                certifications: import("@prisma/client/runtime/client").JsonValue | null;
                yearsOfExperience: number | null;
                licenseAuthority: string | null;
                accreditations: import("@prisma/client/runtime/client").JsonValue | null;
                availableTests: import("@prisma/client/runtime/client").JsonValue | null;
                userId: string;
            } | null;
        };
    }>;
}
