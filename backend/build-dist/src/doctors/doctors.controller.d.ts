import { UpdateDoctorMyProfileDto } from './dto/update-my-profile.dto';
import { DoctorsService } from './doctors.service';
type RequestUser = {
    userId: string;
};
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    getMyProfile(req: {
        user: RequestUser;
    }): Promise<{
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
                labName: string | null;
                pharmacyName: string | null;
                gender: string | null;
                specialization: string | null;
                yearsOfExperience: number | null;
                about: string | null;
                clinicName: string | null;
                clinicAddress: string | null;
                clinicPhone: string | null;
                dateOfBirth: Date | null;
                degrees: import("@prisma/client/runtime/client").JsonValue | null;
                certifications: import("@prisma/client/runtime/client").JsonValue | null;
                availableTimeSlots: import("@prisma/client/runtime/client").JsonValue | null;
                licenseAuthority: string | null;
                accreditations: import("@prisma/client/runtime/client").JsonValue | null;
                availableTests: import("@prisma/client/runtime/client").JsonValue | null;
                licenseNumber: string | null;
                userId: string;
            } | null;
        };
    }>;
    updateMyProfile(req: {
        user: RequestUser;
    }, dto: UpdateDoctorMyProfileDto): Promise<{
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
                labName: string | null;
                pharmacyName: string | null;
                gender: string | null;
                specialization: string | null;
                yearsOfExperience: number | null;
                about: string | null;
                clinicName: string | null;
                clinicAddress: string | null;
                clinicPhone: string | null;
                dateOfBirth: Date | null;
                degrees: import("@prisma/client/runtime/client").JsonValue | null;
                certifications: import("@prisma/client/runtime/client").JsonValue | null;
                availableTimeSlots: import("@prisma/client/runtime/client").JsonValue | null;
                licenseAuthority: string | null;
                accreditations: import("@prisma/client/runtime/client").JsonValue | null;
                availableTests: import("@prisma/client/runtime/client").JsonValue | null;
                licenseNumber: string | null;
                userId: string;
            } | null;
        };
    }>;
}
export {};
