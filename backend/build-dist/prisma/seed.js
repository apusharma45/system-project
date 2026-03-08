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
const rolesToReplace = [client_1.Role.PATIENT, client_1.Role.DOCTOR, client_1.Role.PHARMACY, client_1.Role.DIAGNOSTIC];
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
    }
    const prisma = new client_1.PrismaClient({
        adapter: new adapter_pg_1.PrismaPg({ connectionString }),
    });
    const passwordHash = await bcrypt.hash('Password123!', 10);
    try {
        await prisma.$transaction([
            prisma.labResult.deleteMany({}),
            prisma.prescription.deleteMany({}),
            prisma.labOrder.deleteMany({}),
            prisma.appointment.deleteMany({}),
            prisma.notification.deleteMany({}),
            prisma.auditLog.deleteMany({}),
            prisma.patientProfile.deleteMany({
                where: {
                    patient: {
                        role: { in: rolesToReplace },
                    },
                },
            }),
            prisma.professionalProfile.deleteMany({
                where: {
                    user: {
                        role: { in: rolesToReplace },
                    },
                },
            }),
            prisma.user.deleteMany({
                where: {
                    role: { in: rolesToReplace },
                },
            }),
        ]);
        await prisma.user.createMany({
            data: [
                {
                    fullName: 'Ava Thompson',
                    email: 'patient.ava@medflow.local',
                    phone: '+1-202-555-0101',
                    address: '1200 Market St, San Francisco, CA',
                    passwordHash,
                    role: client_1.Role.PATIENT,
                },
                {
                    fullName: 'Noah Walker',
                    email: 'patient.noah@medflow.local',
                    phone: '+1-202-555-0102',
                    address: '10 Main St, Austin, TX',
                    passwordHash,
                    role: client_1.Role.PATIENT,
                },
                {
                    fullName: 'Dr. Emily Carter',
                    email: 'doctor.emily@medflow.local',
                    phone: '+1-202-555-0201',
                    address: '221B Care Ave, Boston, MA',
                    passwordHash,
                    role: client_1.Role.DOCTOR,
                },
                {
                    fullName: 'Dr. Liam Bennett',
                    email: 'doctor.liam@medflow.local',
                    phone: '+1-202-555-0202',
                    address: '45 Wellness Rd, Seattle, WA',
                    passwordHash,
                    role: client_1.Role.DOCTOR,
                },
                {
                    fullName: 'Sophia Reed',
                    email: 'pharmacy.sophia@medflow.local',
                    phone: '+1-202-555-0301',
                    address: '5 Pharmacy Lane, Denver, CO',
                    passwordHash,
                    role: client_1.Role.PHARMACY,
                },
                {
                    fullName: 'Mason Gray',
                    email: 'pharmacy.mason@medflow.local',
                    phone: '+1-202-555-0302',
                    address: '18 Rx Blvd, Phoenix, AZ',
                    passwordHash,
                    role: client_1.Role.PHARMACY,
                },
                {
                    fullName: 'Olivia Hayes',
                    email: 'lab.olivia@medflow.local',
                    phone: '+1-202-555-0401',
                    address: '300 Diagnostics Dr, Chicago, IL',
                    passwordHash,
                    role: client_1.Role.DIAGNOSTIC,
                },
                {
                    fullName: 'Ethan Cole',
                    email: 'lab.ethan@medflow.local',
                    phone: '+1-202-555-0402',
                    address: '90 Lab Plaza, New York, NY',
                    passwordHash,
                    role: client_1.Role.DIAGNOSTIC,
                },
            ],
        });
        const users = await prisma.user.findMany({
            where: { role: { in: rolesToReplace } },
            select: { id: true, email: true, role: true },
        });
        const getUserId = (email) => {
            const user = users.find((item) => item.email === email);
            if (!user) {
                throw new Error(`User not found after seed insert: ${email}`);
            }
            return user.id;
        };
        await prisma.patientProfile.createMany({
            data: [
                {
                    patientId: getUserId('patient.ava@medflow.local'),
                    gender: 'FEMALE',
                    dateOfBirth: new Date('1994-05-12'),
                    phone: '+1-202-555-0101',
                    address: '1200 Market St, San Francisco, CA',
                },
                {
                    patientId: getUserId('patient.noah@medflow.local'),
                    gender: 'MALE',
                    dateOfBirth: new Date('1990-11-03'),
                    phone: '+1-202-555-0102',
                    address: '10 Main St, Austin, TX',
                },
            ],
        });
        await prisma.professionalProfile.createMany({
            data: [
                {
                    userId: getUserId('doctor.emily@medflow.local'),
                    gender: 'FEMALE',
                    dateOfBirth: new Date('1985-02-18'),
                    specialization: 'Cardiology',
                    licenseNumber: 'DOC-EMILY-1001',
                },
                {
                    userId: getUserId('doctor.liam@medflow.local'),
                    gender: 'MALE',
                    dateOfBirth: new Date('1988-09-27'),
                    specialization: 'Dermatology',
                    licenseNumber: 'DOC-LIAM-1002',
                },
                {
                    userId: getUserId('pharmacy.sophia@medflow.local'),
                    pharmacyName: 'Green Cross Pharmacy',
                    licenseNumber: 'PHARM-SOPHIA-2001',
                },
                {
                    userId: getUserId('pharmacy.mason@medflow.local'),
                    pharmacyName: 'CarePlus Pharmacy',
                    licenseNumber: 'PHARM-MASON-2002',
                },
                {
                    userId: getUserId('lab.olivia@medflow.local'),
                    labName: 'Precision Diagnostics Lab',
                    licenseNumber: 'LAB-OLIVIA-3001',
                },
                {
                    userId: getUserId('lab.ethan@medflow.local'),
                    labName: 'Citywide Clinical Lab',
                    licenseNumber: 'LAB-ETHAN-3002',
                },
            ],
        });
        console.log('Seed completed: replaced PATIENT/DOCTOR/PHARMACY/DIAGNOSTIC users and profiles.');
    }
    finally {
        await prisma.$disconnect();
    }
}
void main().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map