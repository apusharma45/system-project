import { UpdateDiagnosticMyProfileDto } from './dto/update-my-profile.dto';
import { DiagnosticService } from './diagnostic.service';
type RequestUser = {
    userId: string;
};
export declare class DiagnosticController {
    private readonly diagnosticService;
    constructor(diagnosticService: DiagnosticService);
    getMyProfile(req: {
        user: RequestUser;
    }): Promise<{
        diagnostic: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "DIAGNOSTIC";
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
    updateMyProfile(req: {
        user: RequestUser;
    }, dto: UpdateDiagnosticMyProfileDto): Promise<{
        diagnostic: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "DIAGNOSTIC";
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
export {};
