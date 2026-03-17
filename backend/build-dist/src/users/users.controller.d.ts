import { Role } from '../../generated/prisma/client';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: {
        user: unknown;
    }): unknown;
    uploadAvatar(req: {
        user: {
            userId: string;
        };
    }, file: {
        originalname: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
    } | undefined): Promise<{
        user: {
            id: string;
            avatarUrl: string | null;
        };
    }>;
    removeAvatar(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        user: {
            id: string;
            avatarUrl: string | null;
        };
    }>;
    listDoctors(): Promise<{
        id: string;
        fullName: string | null;
        avatarUrl: string | null;
        email: string;
        role: Role;
        specialization: string | null;
        yearsOfExperience: number | null;
    }[]>;
    getDoctorDetails(doctorId: string): Promise<{
        doctor: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            email: string;
            role: "DOCTOR";
            phone: string | null;
            address: string | null;
            specialization: string | null;
            yearsOfExperience: number | null;
            degrees: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | null;
            about: string | null;
            clinicName: string | null;
            clinicAddress: string | null;
            clinicPhone: string | null;
            availableTimeSlots: string | number | boolean | import("@prisma/client/runtime/client").JsonObject | import("@prisma/client/runtime/client").JsonArray | null;
        };
    }>;
    listPharmacies(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        fullName: string | null;
        email: string;
        role: Role;
    }[]>;
    listDiagnostics(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        fullName: string | null;
        email: string;
        role: Role;
    }[]>;
}
