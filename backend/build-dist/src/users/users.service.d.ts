import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private static readonly REGISTER_SELECT;
    findByEmail(email: string): import("../../generated/prisma/models").Prisma__UserClient<{
        id: string;
        email: string;
        fullName: string | null;
        phone: string | null;
        address: string | null;
        passwordHash: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findById(id: string): import("../../generated/prisma/models").Prisma__UserClient<{
        id: string;
        email: string;
        fullName: string | null;
        phone: string | null;
        address: string | null;
        passwordHash: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    createUser(params: {
        fullName: string;
        email: string;
        passwordHash: string;
        role: Role;
        phone: string;
        address: string;
        patientProfile?: {
            gender: string;
            dateOfBirth: Date;
            allergies?: string;
            chronicConditions?: string;
            currentMedications?: string;
            emergencyContactName?: string;
            emergencyContactPhone?: string;
            emergencyContactRelation?: string;
        };
        professionalProfile?: {
            gender?: string;
            dateOfBirth?: Date;
            licenseNumber?: string;
            specialization?: string;
            pharmacyName?: string;
            labName?: string;
            degrees?: string[];
            certifications?: string[];
            yearsOfExperience?: number;
            licenseAuthority?: string;
            accreditations?: string[];
            availableTests?: string[];
        };
    }): import("../../generated/prisma/models").Prisma__UserClient<{
        id: string;
        email: string;
        role: Role;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    listByRole(role: Role): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        email: string;
        fullName: string | null;
        role: Role;
    }[]>;
}
