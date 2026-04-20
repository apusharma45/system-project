import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AppointmentStatus,
  LabOrderStatus,
  NotificationType,
  PrescriptionStatus,
  PrismaClient,
  Role,
} from '../generated/prisma/client';

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
  const now = new Date();
  const addDays = (base: Date, days: number) => new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.labResult.deleteMany({});
        await tx.prescription.deleteMany({});
        await tx.labOrder.deleteMany({});
        await tx.appointment.deleteMany({});
        await tx.notification.deleteMany({});
        await tx.auditLog.deleteMany({});
        await tx.patientProfile.deleteMany({
          where: {
            patient: {
              role: { in: rolesToReplace },
            },
          },
        });
        await tx.professionalProfile.deleteMany({
          where: {
            user: {
              role: { in: rolesToReplace },
            },
          },
        });
        await tx.user.deleteMany({
          where: {
            role: { in: rolesToReplace },
          },
        });
      },
      {
        // Neon can take longer to start/allocate a transaction on cold or shared plans.
        maxWait: 20_000,
        timeout: 60_000,
      },
    );

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
          degrees: ['MBBS', 'MD (Cardiology)'],
          certifications: ['BLS', 'ACLS'],
          yearsOfExperience: 12,
          about:
            'Consultant cardiologist focused on preventive heart care, hypertension, and post-acute cardiac recovery.',
          clinicName: 'Bay Heart & Wellness Center',
          clinicAddress: '221B Care Ave, Boston, MA',
          clinicPhone: '+1-202-555-6201',
          availableTimeSlots: [
            { day: 'MONDAY', startTime: '09:00', endTime: '12:30' },
            { day: 'WEDNESDAY', startTime: '14:00', endTime: '18:00' },
            { day: 'FRIDAY', startTime: '10:00', endTime: '13:00' },
          ],
        },
        {
          userId: getUserId('doctor.liam@medflow.local'),
          gender: 'MALE',
          dateOfBirth: new Date('1988-09-27'),
          specialization: 'Dermatology',
          licenseNumber: 'DOC-LIAM-1002',
          degrees: ['MBBS', 'MD (Dermatology)'],
          certifications: ['Dermatologic Surgery Board'],
          yearsOfExperience: 9,
          about:
            'Dermatologist managing chronic skin disorders, allergy-driven rashes, and procedural skin treatments.',
          clinicName: 'Northwest Skin Clinic',
          clinicAddress: '45 Wellness Rd, Seattle, WA',
          clinicPhone: '+1-202-555-6202',
          availableTimeSlots: [
            { day: 'TUESDAY', startTime: '10:00', endTime: '13:00' },
            { day: 'THURSDAY', startTime: '15:00', endTime: '19:00' },
          ],
        },
        {
          userId: getUserId('pharmacy.sophia@medflow.local'),
          pharmacyName: 'Green Cross Pharmacy',
          licenseNumber: 'PHARM-SOPHIA-2001',
          licenseAuthority: 'California Board of Pharmacy',
        },
        {
          userId: getUserId('pharmacy.mason@medflow.local'),
          pharmacyName: 'CarePlus Pharmacy',
          licenseNumber: 'PHARM-MASON-2002',
          licenseAuthority: 'Arizona State Board of Pharmacy',
        },
        {
          userId: getUserId('lab.olivia@medflow.local'),
          labName: 'Precision Diagnostics Lab',
          licenseNumber: 'LAB-OLIVIA-3001',
          accreditations: ['CAP', 'CLIA'],
          availableTests: ['CBC', 'Lipid Profile', 'HbA1c', 'Liver Function'],
        },
        {
          userId: getUserId('lab.ethan@medflow.local'),
          labName: 'Citywide Clinical Lab',
          licenseNumber: 'LAB-ETHAN-3002',
          accreditations: ['CLIA'],
          availableTests: ['Skin Biopsy', 'Allergy Panel'],
        },
      ],
    });

    const patientAvaId = getUserId('patient.ava@medflow.local');
    const patientNoahId = getUserId('patient.noah@medflow.local');
    const doctorEmilyId = getUserId('doctor.emily@medflow.local');
    const doctorLiamId = getUserId('doctor.liam@medflow.local');
    const pharmacySophiaId = getUserId('pharmacy.sophia@medflow.local');
    const pharmacyMasonId = getUserId('pharmacy.mason@medflow.local');
    const labOliviaId = getUserId('lab.olivia@medflow.local');
    const labEthanId = getUserId('lab.ethan@medflow.local');

    await prisma.patientProfile.updateMany({
      where: { patientId: patientAvaId },
      data: {
        allergies: 'Penicillin',
        chronicConditions: 'Hypertension',
        currentMedications: 'Amlodipine 5mg once daily',
        emergencyContactName: 'Mia Thompson',
        emergencyContactPhone: '+1-202-555-5101',
        emergencyContactRelation: 'Sister',
      },
    });
    await prisma.patientProfile.updateMany({
      where: { patientId: patientNoahId },
      data: {
        allergies: 'None known',
        chronicConditions: 'Eczema',
        currentMedications: 'Topical steroid as needed',
        emergencyContactName: 'Henry Walker',
        emergencyContactPhone: '+1-202-555-5102',
        emergencyContactRelation: 'Father',
      },
    });

    const avaConfirmedAppointment = await prisma.appointment.create({
      data: {
        patientId: patientAvaId,
        doctorId: doctorEmilyId,
        status: AppointmentStatus.CONFIRMED,
        scheduledAt: addDays(now, 2),
        reason: 'Recurring chest discomfort and blood pressure follow-up',
        preferredDateFrom: addDays(now, 1),
        preferredDateTo: addDays(now, 3),
        preferredTimeNote: 'Morning preferred',
        requiresLab: false,
        labFlowLocked: false,
      },
    });

    const avaClosedAppointment = await prisma.appointment.create({
      data: {
        patientId: patientAvaId,
        doctorId: doctorEmilyId,
        status: AppointmentStatus.CLOSED,
        scheduledAt: addDays(now, -10),
        reason: 'Post-visit review for elevated lipid profile',
        preferredDateFrom: addDays(now, -12),
        preferredDateTo: addDays(now, -10),
        preferredTimeNote: 'Any time after 10 AM',
        requiresLab: true,
        labFlowLocked: false,
      },
    });

    const noahExamDoneAppointment = await prisma.appointment.create({
      data: {
        patientId: patientNoahId,
        doctorId: doctorLiamId,
        status: AppointmentStatus.EXAM_DONE,
        scheduledAt: addDays(now, -3),
        reason: 'Persistent eczema flare-up',
        preferredDateFrom: addDays(now, -5),
        preferredDateTo: addDays(now, -3),
        preferredTimeNote: 'Evening slot preferred',
        requiresLab: true,
        labFlowLocked: false,
      },
    });

    await prisma.appointment.create({
      data: {
        patientId: patientNoahId,
        doctorId: doctorLiamId,
        status: AppointmentStatus.REQUESTED,
        scheduledAt: null,
        reason: 'Follow-up after starting topical treatment',
        preferredDateFrom: addDays(now, 4),
        preferredDateTo: addDays(now, 7),
        preferredTimeNote: 'Late afternoon preferred',
        requiresLab: false,
        labFlowLocked: false,
      },
    });

    const avaLabOrder = await prisma.labOrder.create({
      data: {
        appointmentId: avaClosedAppointment.id,
        diagnosticId: labOliviaId,
        status: LabOrderStatus.SENT,
        tests: [
          { title: 'Lipid Profile', description: 'Fasting lipid panel' },
          { title: 'HbA1c', description: 'Average glucose for 3 months' },
        ],
      },
    });

    const noahLabOrder = await prisma.labOrder.create({
      data: {
        appointmentId: noahExamDoneAppointment.id,
        diagnosticId: labEthanId,
        status: LabOrderStatus.ASSIGNED,
        tests: [{ title: 'Allergy Panel', description: 'Common dermatologic allergens' }],
      },
    });

    await prisma.labResult.createMany({
      data: [
        {
          labOrderId: avaLabOrder.id,
          fileUrl: 'https://example.com/reports/ava-lipid-profile.pdf',
          fileMimeType: 'application/pdf',
          filePublicId: 'reports/ava-lipid-profile',
          fileSizeBytes: 254321,
          uploadedAt: addDays(now, -9),
        },
        {
          labOrderId: avaLabOrder.id,
          fileUrl: 'https://example.com/reports/ava-hba1c.pdf',
          fileMimeType: 'application/pdf',
          filePublicId: 'reports/ava-hba1c',
          fileSizeBytes: 198765,
          uploadedAt: addDays(now, -9),
        },
      ],
    });

    await prisma.prescription.createMany({
      data: [
        {
          appointmentId: avaClosedAppointment.id,
          doctorId: doctorEmilyId,
          pharmacyId: pharmacySophiaId,
          notes: 'Continue lifestyle modification and keep BP diary.',
          diagnosis: 'Essential hypertension with dyslipidemia',
          instructions: 'Take medicines after food. Follow up in 2 weeks.',
          medications: [
            {
              name: 'Amlodipine',
              dosage: '5 mg',
              frequency: 'Once daily',
              duration: '30 days',
              route: 'Oral',
            },
            {
              name: 'Atorvastatin',
              dosage: '10 mg',
              frequency: 'Once nightly',
              duration: '30 days',
              route: 'Oral',
            },
          ],
          status: PrescriptionStatus.SENT_TO_PATIENT,
          documentUrl: 'https://example.com/prescriptions/ava-prescription.pdf',
          documentPublicId: 'prescriptions/ava-prescription',
          documentMimeType: 'application/pdf',
          documentVersion: 1,
        },
        {
          appointmentId: noahExamDoneAppointment.id,
          doctorId: doctorLiamId,
          pharmacyId: pharmacyMasonId,
          notes: 'Avoid known irritants and moisturize skin twice daily.',
          diagnosis: 'Atopic dermatitis flare',
          instructions: 'Use topical therapy on affected areas only.',
          medications: [
            {
              name: 'Hydrocortisone Cream',
              dosage: '1%',
              frequency: 'Twice daily',
              duration: '14 days',
              route: 'Topical',
            },
            {
              name: 'Cetirizine',
              dosage: '10 mg',
              frequency: 'Once nightly',
              duration: '10 days',
              route: 'Oral',
            },
          ],
          status: PrescriptionStatus.SENT_TO_PHARMACY,
          documentUrl: 'https://example.com/prescriptions/noah-prescription.pdf',
          documentPublicId: 'prescriptions/noah-prescription',
          documentMimeType: 'application/pdf',
          documentVersion: 1,
        },
      ],
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: patientAvaId,
          type: NotificationType.PRESCRIPTION_READY,
          message: 'Your prescription is ready for download.',
          read: false,
          createdAt: addDays(now, -8),
        },
        {
          userId: patientAvaId,
          type: NotificationType.LAB_RESULT_UPLOADED,
          message: 'New lab results were uploaded to your records.',
          read: false,
          createdAt: addDays(now, -8),
        },
        {
          userId: patientNoahId,
          type: NotificationType.LAB_ASSIGNED,
          message: 'A diagnostic lab has been assigned to your appointment.',
          read: true,
          createdAt: addDays(now, -2),
        },
        {
          userId: pharmacyMasonId,
          type: NotificationType.PRESCRIPTION_READY,
          message: 'A prescription is ready for fulfillment.',
          read: false,
          createdAt: addDays(now, -2),
        },
        {
          userId: labEthanId,
          type: NotificationType.LAB_ASSIGNED,
          message: 'A new lab order has been assigned.',
          read: false,
          createdAt: addDays(now, -2),
        },
      ],
    });

    console.log('Seed completed with enriched doctor profiles, appointments, labs, prescriptions, and notifications.');
    console.log('Credentials unchanged for all seeded users: Password123!');
    console.log('Seeded sample appointment IDs:', {
      avaConfirmedAppointmentId: avaConfirmedAppointment.id,
      avaClosedAppointmentId: avaClosedAppointment.id,
      noahExamDoneAppointmentId: noahExamDoneAppointment.id,
      avaLabOrderId: avaLabOrder.id,
      noahLabOrderId: noahLabOrder.id,
    });
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
