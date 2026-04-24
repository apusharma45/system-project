"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
    }
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@medflow.local';
    const password = process.env.ADMIN_PASSWORD || 'Password123!';
    const fullName = process.env.ADMIN_FULL_NAME?.trim() || 'MedFlow Admin';
    const phone = process.env.ADMIN_PHONE?.trim() || '+8801700000000';
    const address = process.env.ADMIN_ADDRESS?.trim() || 'MedFlow Admin Console';
    const prisma = new client_1.PrismaClient({
        adapter: new adapter_pg_1.PrismaPg({ connectionString }),
    });
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const admin = await prisma.user.upsert({
            where: { email },
            update: {
                fullName,
                phone,
                address,
                role: client_1.Role.ADMIN,
                passwordHash,
            },
            create: {
                email,
                fullName,
                phone,
                address,
                role: client_1.Role.ADMIN,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                role: true,
                fullName: true,
            },
        });
        console.log('Admin user seeded successfully.');
        console.log(JSON.stringify({
            id: admin.id,
            email: admin.email,
            role: admin.role,
            fullName: admin.fullName,
            password,
        }, null, 2));
    }
    finally {
        await prisma.$disconnect();
    }
}
void main().catch((error) => {
    console.error('Admin seed failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-admin.js.map