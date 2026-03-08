import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';

const rolesToReplace: Role[] = [Role.PATIENT, Role.DOCTOR, Role.PHARMACY, Role.DIAGNOSTIC];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
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
          role: Role.PATIENT,
        },
        {
          fullName: 'Noah Walker',
          email: 'patient.noah@medflow.local',
          phone: '+1-202-555-0102',
          address: '10 Main St, Austin, TX',
          passwordHash,
          role: Role.PATIENT,
        },
        {
          fullName: 'Dr. Emily Carter',
          email: 'doctor.emily@medflow.local',
          phone: '+1-202-555-0201',
          address: '221B Care Ave, Boston, MA',
          passwordHash,
          role: Role.DOCTOR,
        },
        {
          fullName: 'Dr. Liam Bennett',
          email: 'doctor.liam@medflow.local',
          phone: '+1-202-555-0202',
          address: '45 Wellness Rd, Seattle, WA',
          passwordHash,
          role: Role.DOCTOR,
        },
        {
          fullName: 'Sophia Reed',
          email: 'pharmacy.sophia@medflow.local',
          phone: '+1-202-555-0301',
          address: '5 Pharmacy Lane, Denver, CO',
          passwordHash,
          role: Role.PHARMACY,
        },
        {
          fullName: 'Mason Gray',
          email: 'pharmacy.mason@medflow.local',
          phone: '+1-202-555-0302',
          address: '18 Rx Blvd, Phoenix, AZ',
          passwordHash,
          role: Role.PHARMACY,
        },
        {
          fullName: 'Olivia Hayes',
          email: 'lab.olivia@medflow.local',
          phone: '+1-202-555-0401',
          address: '300 Diagnostics Dr, Chicago, IL',
          passwordHash,
          role: Role.DIAGNOSTIC,
        },
        {
          fullName: 'Ethan Cole',
          email: 'lab.ethan@medflow.local',
          phone: '+1-202-555-0402',
          address: '90 Lab Plaza, New York, NY',
          passwordHash,
          role: Role.DIAGNOSTIC,
        },
      ],
    });

    const users = await prisma.user.findMany({
      where: { role: { in: rolesToReplace } },
      select: { id: true, email: true, role: true },
    });

    const getUserId = (email: string) => {
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
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
