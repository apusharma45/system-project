import { Role } from '../../generated/prisma/client';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: {
        user: unknown;
    }): unknown;
    listDoctors(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        email: string;
        role: Role;
    }[]>;
    listPharmacies(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        email: string;
        role: Role;
    }[]>;
    listDiagnostics(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        email: string;
        role: Role;
    }[]>;
}
