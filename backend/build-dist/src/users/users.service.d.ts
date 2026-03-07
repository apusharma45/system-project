import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): import("../../generated/prisma/models").Prisma__UserClient<{
        id: string;
        email: string;
        fullName: string | null;
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
    }): import("../../generated/prisma/models").Prisma__UserClient<{
        id: string;
        email: string;
        fullName: string | null;
        passwordHash: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
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
