import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkDatabase(): Promise<{
        status: "ok";
    }>;
}
