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
    listDoctors(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        fullName: string | null;
        email: string;
        role: Role;
    }[]>;
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
