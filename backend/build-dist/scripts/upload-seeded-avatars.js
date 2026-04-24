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
const promises_1 = require("fs/promises");
const path = __importStar(require("path"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
const cloudinary_service_1 = require("../src/cloudinary/cloudinary.service");
const avatarMappings = [
    { email: 'doctor.farhana@medflow.local', role: client_1.Role.DOCTOR, relativePath: 'images/doctors/doctor1.jpg' },
    { email: 'doctor.tanvir@medflow.local', role: client_1.Role.DOCTOR, relativePath: 'images/doctors/doctor2.jpg' },
    { email: 'doctor.nusreen@medflow.local', role: client_1.Role.DOCTOR, relativePath: 'images/doctors/doctor3.jpg' },
    { email: 'doctor.mahmudul@medflow.local', role: client_1.Role.DOCTOR, relativePath: 'images/patients/doctor4.jpg' },
    { email: 'doctor.samiha@medflow.local', role: client_1.Role.DOCTOR, relativePath: 'images/doctors/doctor5.jpg' },
    { email: 'patient.ayesha@medflow.local', role: client_1.Role.PATIENT, relativePath: 'images/patients/patient1.jpg' },
    { email: 'patient.mehedi@medflow.local', role: client_1.Role.PATIENT, relativePath: 'images/patients/patient2.jpg' },
    { email: 'patient.nusrat@medflow.local', role: client_1.Role.PATIENT, relativePath: 'images/patients/patient3.jpg' },
    { email: 'patient.farhan@medflow.local', role: client_1.Role.PATIENT, relativePath: 'images/patients/patient4.jpg' },
    {
        email: 'patient.sadia@medflow.local',
        role: client_1.Role.PATIENT,
        relativePath: 'images/avatars/bangladesh/doctors/dr-farhana-rahman.png',
    },
    {
        email: 'pharmacy.dhaka.care@medflow.local',
        role: client_1.Role.PHARMACY,
        relativePath: 'images/pharmacy/pharmacy_1.png',
    },
    {
        email: 'pharmacy.ctg.city@medflow.local',
        role: client_1.Role.PHARMACY,
        relativePath: 'images/pharmacy/pharmacy_2.png',
    },
    {
        email: 'pharmacy.sylhet.family@medflow.local',
        role: client_1.Role.PHARMACY,
        relativePath: 'images/pharmacy/pharmacy_3.png',
    },
    {
        email: 'pharmacy.khulna.trust@medflow.local',
        role: client_1.Role.PHARMACY,
        relativePath: 'images/pharmacy/pharmacy_4.png',
    },
    {
        email: 'pharmacy.rajshahi.medipoint@medflow.local',
        role: client_1.Role.PHARMACY,
        relativePath: 'images/pharmacy/pharmacy_5.png',
    },
    { email: 'lab.dhaka.central@medflow.local', role: client_1.Role.DIAGNOSTIC, relativePath: 'images/labs/lab_1.png' },
    { email: 'lab.ctg.metro@medflow.local', role: client_1.Role.DIAGNOSTIC, relativePath: 'images/labs/lab_2.png' },
    { email: 'lab.sylhet.care@medflow.local', role: client_1.Role.DIAGNOSTIC, relativePath: 'images/labs/lab_3.png' },
    { email: 'lab.khulna.advanced@medflow.local', role: client_1.Role.DIAGNOSTIC, relativePath: 'images/labs/lab_4.png' },
    {
        email: 'lab.rajshahi.clinical@medflow.local',
        role: client_1.Role.DIAGNOSTIC,
        relativePath: 'images/labs/lab_5.png',
    },
];
function mimeTypeFor(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    if (extension === '.png') {
        return 'image/png';
    }
    if (extension === '.webp') {
        return 'image/webp';
    }
    return 'image/jpeg';
}
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
    }
    const prisma = new client_1.PrismaClient({
        adapter: new adapter_pg_1.PrismaPg({ connectionString }),
    });
    const cloudinary = new cloudinary_service_1.CloudinaryService();
    const workspaceRoot = path.resolve(__dirname, '..', '..');
    try {
        for (const mapping of avatarMappings) {
            const absolutePath = path.resolve(workspaceRoot, mapping.relativePath);
            const fileBuffer = await (0, promises_1.readFile)(absolutePath);
            const mimeType = mimeTypeFor(absolutePath);
            const user = await prisma.user.findUnique({
                where: { email: mapping.email },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    avatarPublicId: true,
                },
            });
            if (!user) {
                throw new Error(`User not found for avatar upload: ${mapping.email}`);
            }
            if (user.role !== mapping.role) {
                throw new Error(`Role mismatch for ${mapping.email}. Expected ${mapping.role}, got ${user.role}`);
            }
            if (user.avatarPublicId) {
                await cloudinary.destroy(user.avatarPublicId, 'image');
            }
            const upload = await cloudinary.uploadBuffer({
                buffer: fileBuffer,
                fileName: path.basename(absolutePath),
                folder: `profile-avatars/${user.id}`,
                contentType: mimeType,
                resourceType: 'image',
            });
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    avatarUrl: upload.url,
                    avatarPublicId: upload.publicId,
                    avatarMimeType: upload.mimeType,
                    avatarSizeBytes: upload.bytes,
                },
            });
            console.log(`Uploaded avatar for ${mapping.email} from ${mapping.relativePath}`);
        }
        console.log(`Uploaded ${avatarMappings.length} seeded avatars successfully.`);
    }
    finally {
        await prisma.$disconnect();
    }
}
void main().catch((error) => {
    console.error('Seeded avatar upload failed:', error);
    process.exit(1);
});
//# sourceMappingURL=upload-seeded-avatars.js.map