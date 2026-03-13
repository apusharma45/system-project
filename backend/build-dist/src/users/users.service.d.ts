import { Role } from '../../generated/prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    private readonly cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    private static readonly REGISTER_SELECT;
    private static readonly ALLOWED_AVATAR_MIME_TYPES;
    private static readonly MAX_AVATAR_SIZE_BYTES;
    findByEmail(email: string): import("../../generated/prisma/models").Prisma__UserClient<{
        id: string;
        fullName: string | null;
        avatarUrl: string | null;
        avatarPublicId: string | null;
        avatarMimeType: string | null;
        avatarSizeBytes: number | null;
        email: string;
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
        fullName: string | null;
        avatarUrl: string | null;
        avatarPublicId: string | null;
        avatarMimeType: string | null;
        avatarSizeBytes: number | null;
        email: string;
        phone: string | null;
        address: string | null;
        passwordHash: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    uploadMyAvatar(userId: string, file: {
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
    removeMyAvatar(userId: string): Promise<{
        user: {
            id: string;
            avatarUrl: string | null;
        };
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
        avatarUrl: string | null;
        email: string;
        role: Role;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    listByRole(role: Role): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        fullName: string | null;
        email: string;
        role: Role;
    }[]>;
    listDoctorsForPatients(): Promise<{
        id: string;
        fullName: string | null;
        avatarUrl: string | null;
        email: string;
        role: Role;
        specialization: string | null;
        yearsOfExperience: number | null;
    }[]>;
    getDoctorDetailsForPatients(doctorId: string): Promise<{
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
}
