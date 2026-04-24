import 'dotenv/config';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';
import { CloudinaryService } from '../src/cloudinary/cloudinary.service';

type AvatarMapping = {
  email: string;
  role: Role;
  relativePath: string;
};

const avatarMappings: AvatarMapping[] = [
  { email: 'doctor.farhana@medflow.local', role: Role.DOCTOR, relativePath: 'images/doctors/doctor1.jpg' },
  { email: 'doctor.tanvir@medflow.local', role: Role.DOCTOR, relativePath: 'images/doctors/doctor2.jpg' },
  { email: 'doctor.nusreen@medflow.local', role: Role.DOCTOR, relativePath: 'images/doctors/doctor3.jpg' },
  { email: 'doctor.mahmudul@medflow.local', role: Role.DOCTOR, relativePath: 'images/patients/doctor4.jpg' },
  { email: 'doctor.samiha@medflow.local', role: Role.DOCTOR, relativePath: 'images/doctors/doctor5.jpg' },

  { email: 'patient.ayesha@medflow.local', role: Role.PATIENT, relativePath: 'images/patients/patient1.jpg' },
  { email: 'patient.mehedi@medflow.local', role: Role.PATIENT, relativePath: 'images/patients/patient2.jpg' },
  { email: 'patient.nusrat@medflow.local', role: Role.PATIENT, relativePath: 'images/patients/patient3.jpg' },
  { email: 'patient.farhan@medflow.local', role: Role.PATIENT, relativePath: 'images/patients/patient4.jpg' },
  {
    email: 'patient.sadia@medflow.local',
    role: Role.PATIENT,
    relativePath: 'images/avatars/bangladesh/doctors/dr-farhana-rahman.png',
  },

  {
    email: 'pharmacy.dhaka.care@medflow.local',
    role: Role.PHARMACY,
    relativePath: 'images/pharmacy/pharmacy_1.png',
  },
  {
    email: 'pharmacy.ctg.city@medflow.local',
    role: Role.PHARMACY,
    relativePath: 'images/pharmacy/pharmacy_2.png',
  },
  {
    email: 'pharmacy.sylhet.family@medflow.local',
    role: Role.PHARMACY,
    relativePath: 'images/pharmacy/pharmacy_3.png',
  },
  {
    email: 'pharmacy.khulna.trust@medflow.local',
    role: Role.PHARMACY,
    relativePath: 'images/pharmacy/pharmacy_4.png',
  },
  {
    email: 'pharmacy.rajshahi.medipoint@medflow.local',
    role: Role.PHARMACY,
    relativePath: 'images/pharmacy/pharmacy_5.png',
  },

  { email: 'lab.dhaka.central@medflow.local', role: Role.DIAGNOSTIC, relativePath: 'images/labs/lab_1.png' },
  { email: 'lab.ctg.metro@medflow.local', role: Role.DIAGNOSTIC, relativePath: 'images/labs/lab_2.png' },
  { email: 'lab.sylhet.care@medflow.local', role: Role.DIAGNOSTIC, relativePath: 'images/labs/lab_3.png' },
  { email: 'lab.khulna.advanced@medflow.local', role: Role.DIAGNOSTIC, relativePath: 'images/labs/lab_4.png' },
  {
    email: 'lab.rajshahi.clinical@medflow.local',
    role: Role.DIAGNOSTIC,
    relativePath: 'images/labs/lab_5.png',
  },
];

function mimeTypeFor(filePath: string) {
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

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  const cloudinary = new CloudinaryService();
  const workspaceRoot = path.resolve(__dirname, '..', '..');

  try {
    for (const mapping of avatarMappings) {
      const absolutePath = path.resolve(workspaceRoot, mapping.relativePath);
      const fileBuffer = await readFile(absolutePath);
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
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error('Seeded avatar upload failed:', error);
  process.exit(1);
});
