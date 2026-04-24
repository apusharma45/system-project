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

type PatientSeed = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
};

type DoctorSeed = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  specialization: string;
  licenseNumber: string;
  degrees: string[];
  certifications: string[];
  yearsOfExperience: number;
  about: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  availableTimeSlots: Array<{ day: string; startTime: string; endTime: string }>;
};

type OrganizationSeed = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseAuthority?: string;
  pharmacyName?: string;
  labName?: string;
  accreditations?: string[];
  availableTests?: string[];
};

const patients: PatientSeed[] = [
  {
    fullName: 'Ayesha Rahman',
    email: 'patient.ayesha@medflow.local',
    phone: '+8801711001001',
    address: 'Dhanmondi, Dhaka, Bangladesh',
    gender: 'FEMALE',
    dateOfBirth: '1992-03-14',
    allergies: 'Penicillin',
    chronicConditions: 'Hypertension',
    currentMedications: 'Amlodipine 5mg once daily',
    emergencyContactName: 'Nabila Rahman',
    emergencyContactPhone: '+8801711001091',
    emergencyContactRelation: 'Sister',
  },
  {
    fullName: 'Mehedi Hasan',
    email: 'patient.mehedi@medflow.local',
    phone: '+8801711001002',
    address: 'Panchlaish, Chattogram, Bangladesh',
    gender: 'MALE',
    dateOfBirth: '1989-08-22',
    allergies: 'None known',
    chronicConditions: 'Atopic dermatitis',
    currentMedications: 'Cetirizine as needed',
    emergencyContactName: 'Kamal Hasan',
    emergencyContactPhone: '+8801711001092',
    emergencyContactRelation: 'Brother',
  },
  {
    fullName: 'Nusrat Jahan',
    email: 'patient.nusrat@medflow.local',
    phone: '+8801711001003',
    address: 'Zindabazar, Sylhet, Bangladesh',
    gender: 'FEMALE',
    dateOfBirth: '1997-11-05',
    allergies: 'Dust allergy',
    chronicConditions: 'Migraine',
    currentMedications: 'Naproxen as needed',
    emergencyContactName: 'Sharmeen Akter',
    emergencyContactPhone: '+8801711001093',
    emergencyContactRelation: 'Mother',
  },
  {
    fullName: 'Farhan Kabir',
    email: 'patient.farhan@medflow.local',
    phone: '+8801711001004',
    address: 'Sonadanga, Khulna, Bangladesh',
    gender: 'MALE',
    dateOfBirth: '1985-01-28',
    allergies: 'None known',
    chronicConditions: 'Low back pain',
    currentMedications: 'Calcium and vitamin D supplement',
    emergencyContactName: 'Rafiqa Kabir',
    emergencyContactPhone: '+8801711001094',
    emergencyContactRelation: 'Wife',
  },
  {
    fullName: 'Sadia Akter',
    email: 'patient.sadia@medflow.local',
    phone: '+8801711001005',
    address: 'Boalia, Rajshahi, Bangladesh',
    gender: 'FEMALE',
    dateOfBirth: '1990-06-17',
    allergies: 'Seafood',
    chronicConditions: 'Type 2 diabetes',
    currentMedications: 'Metformin 500mg twice daily',
    emergencyContactName: 'Masud Rana',
    emergencyContactPhone: '+8801711001095',
    emergencyContactRelation: 'Husband',
  },
];

const doctors: DoctorSeed[] = [
  {
    fullName: 'Dr. Farhana Rahman',
    email: 'doctor.farhana@medflow.local',
    phone: '+8801812002001',
    address: 'Dhanmondi, Dhaka, Bangladesh',
    gender: 'FEMALE',
    dateOfBirth: '1984-02-11',
    specialization: 'Cardiology',
    licenseNumber: 'BMDC-DOC-1001',
    degrees: ['MBBS', 'MD (Cardiology)'],
    certifications: ['BLS', 'ACLS'],
    yearsOfExperience: 13,
    about:
      'Consultant cardiologist focused on hypertension, preventive cardiac care, and long-term chronic disease management.',
    clinicName: 'Dhaka Heart & Medicine Center',
    clinicAddress: 'Green Road, Dhaka, Bangladesh',
    clinicPhone: '+8809612002001',
    availableTimeSlots: [
      { day: 'SUNDAY', startTime: '09:00', endTime: '13:00' },
      { day: 'TUESDAY', startTime: '17:00', endTime: '20:00' },
      { day: 'THURSDAY', startTime: '10:00', endTime: '14:00' },
    ],
  },
  {
    fullName: 'Dr. Tanvir Ahmed',
    email: 'doctor.tanvir@medflow.local',
    phone: '+8801812002002',
    address: 'Khulshi, Chattogram, Bangladesh',
    gender: 'MALE',
    dateOfBirth: '1987-09-19',
    specialization: 'Dermatology',
    licenseNumber: 'BMDC-DOC-1002',
    degrees: ['MBBS', 'DDV'],
    certifications: ['Dermatoscopy Workshop'],
    yearsOfExperience: 10,
    about:
      'Dermatologist managing chronic eczema, acne, fungal infections, and allergy-driven skin conditions.',
    clinicName: 'Chattogram Skin Care Clinic',
    clinicAddress: 'GEC Circle, Chattogram, Bangladesh',
    clinicPhone: '+8809612002002',
    availableTimeSlots: [
      { day: 'MONDAY', startTime: '15:00', endTime: '19:00' },
      { day: 'WEDNESDAY', startTime: '16:00', endTime: '20:00' },
    ],
  },
  {
    fullName: 'Dr. Nusreen Sultana',
    email: 'doctor.nusreen@medflow.local',
    phone: '+8801812002003',
    address: 'Amberkhana, Sylhet, Bangladesh',
    gender: 'FEMALE',
    dateOfBirth: '1988-12-03',
    specialization: 'Pediatrics',
    licenseNumber: 'BMDC-DOC-1003',
    degrees: ['MBBS', 'FCPS (Pediatrics)'],
    certifications: ['PALS'],
    yearsOfExperience: 9,
    about:
      'Pediatric specialist supporting childhood fever, nutrition concerns, asthma follow-up, and routine care.',
    clinicName: 'Sylhet Children Care Point',
    clinicAddress: 'Mirboxtula, Sylhet, Bangladesh',
    clinicPhone: '+8809612002003',
    availableTimeSlots: [
      { day: 'SUNDAY', startTime: '16:00', endTime: '20:00' },
      { day: 'TUESDAY', startTime: '10:00', endTime: '13:00' },
      { day: 'FRIDAY', startTime: '18:00', endTime: '21:00' },
    ],
  },
  {
    fullName: 'Dr. Mahmudul Karim',
    email: 'doctor.mahmudul@medflow.local',
    phone: '+8801812002004',
    address: 'Moylapota, Khulna, Bangladesh',
    gender: 'MALE',
    dateOfBirth: '1982-07-26',
    specialization: 'Orthopedics',
    licenseNumber: 'BMDC-DOC-1004',
    degrees: ['MBBS', 'MS (Orthopedics)'],
    certifications: ['AO Trauma Basic'],
    yearsOfExperience: 15,
    about:
      'Orthopedic surgeon for joint pain, spine-related discomfort, minor trauma, and rehabilitation planning.',
    clinicName: 'Khulna Bone & Joint Center',
    clinicAddress: 'KDA Avenue, Khulna, Bangladesh',
    clinicPhone: '+8809612002004',
    availableTimeSlots: [
      { day: 'MONDAY', startTime: '09:00', endTime: '12:00' },
      { day: 'THURSDAY', startTime: '17:00', endTime: '21:00' },
    ],
  },
  {
    fullName: 'Dr. Samiha Chowdhury',
    email: 'doctor.samiha@medflow.local',
    phone: '+8801812002005',
    address: 'Laxmipur, Rajshahi, Bangladesh',
    gender: 'FEMALE',
    dateOfBirth: '1986-04-08',
    specialization: 'Endocrinology',
    licenseNumber: 'BMDC-DOC-1005',
    degrees: ['MBBS', 'MD (Endocrinology)'],
    certifications: ['Diabetes Educator Training'],
    yearsOfExperience: 11,
    about:
      'Endocrinologist treating diabetes, thyroid disorders, metabolic conditions, and long-term lifestyle guidance.',
    clinicName: 'Rajshahi Diabetes & Hormone Center',
    clinicAddress: 'Shaheb Bazar, Rajshahi, Bangladesh',
    clinicPhone: '+8809612002005',
    availableTimeSlots: [
      { day: 'SUNDAY', startTime: '11:00', endTime: '15:00' },
      { day: 'WEDNESDAY', startTime: '16:00', endTime: '19:00' },
      { day: 'FRIDAY', startTime: '09:00', endTime: '12:00' },
    ],
  },
];

const pharmacies: OrganizationSeed[] = [
  {
    fullName: 'Dhaka Care Pharmacy',
    email: 'pharmacy.dhaka.care@medflow.local',
    phone: '+8801913003001',
    address: 'Panthapath, Dhaka, Bangladesh',
    pharmacyName: 'Dhaka Care Pharmacy',
    licenseNumber: 'DGDA-PHARM-2001',
    licenseAuthority: 'Directorate General of Drug Administration, Bangladesh',
  },
  {
    fullName: 'Chattogram City Pharmacy',
    email: 'pharmacy.ctg.city@medflow.local',
    phone: '+8801913003002',
    address: 'Agrabad, Chattogram, Bangladesh',
    pharmacyName: 'Chattogram City Pharmacy',
    licenseNumber: 'DGDA-PHARM-2002',
    licenseAuthority: 'Directorate General of Drug Administration, Bangladesh',
  },
  {
    fullName: 'Sylhet Family Pharmacy',
    email: 'pharmacy.sylhet.family@medflow.local',
    phone: '+8801913003003',
    address: 'Bondor Bazar, Sylhet, Bangladesh',
    pharmacyName: 'Sylhet Family Pharmacy',
    licenseNumber: 'DGDA-PHARM-2003',
    licenseAuthority: 'Directorate General of Drug Administration, Bangladesh',
  },
  {
    fullName: 'Khulna Trust Pharmacy',
    email: 'pharmacy.khulna.trust@medflow.local',
    phone: '+8801913003004',
    address: 'Joragate, Khulna, Bangladesh',
    pharmacyName: 'Khulna Trust Pharmacy',
    licenseNumber: 'DGDA-PHARM-2004',
    licenseAuthority: 'Directorate General of Drug Administration, Bangladesh',
  },
  {
    fullName: 'Rajshahi MediPoint Pharmacy',
    email: 'pharmacy.rajshahi.medipoint@medflow.local',
    phone: '+8801913003005',
    address: 'New Market, Rajshahi, Bangladesh',
    pharmacyName: 'Rajshahi MediPoint Pharmacy',
    licenseNumber: 'DGDA-PHARM-2005',
    licenseAuthority: 'Directorate General of Drug Administration, Bangladesh',
  },
];

const labs: OrganizationSeed[] = [
  {
    fullName: 'Dhaka Central Diagnostic Lab',
    email: 'lab.dhaka.central@medflow.local',
    phone: '+8801614004001',
    address: 'Shyamoli, Dhaka, Bangladesh',
    labName: 'Dhaka Central Diagnostic Lab',
    licenseNumber: 'DGHS-LAB-3001',
    accreditations: ['ISO 15189', 'DGHS Registered'],
    availableTests: ['CBC', 'Lipid Profile', 'HbA1c', 'Creatinine', 'Troponin I'],
  },
  {
    fullName: 'Chattogram Metro Lab',
    email: 'lab.ctg.metro@medflow.local',
    phone: '+8801614004002',
    address: 'Nasirabad, Chattogram, Bangladesh',
    labName: 'Chattogram Metro Lab',
    licenseNumber: 'DGHS-LAB-3002',
    accreditations: ['DGHS Registered'],
    availableTests: ['Allergy Panel', 'IgE', 'Skin Scraping', 'CBC'],
  },
  {
    fullName: 'Sylhet Care Diagnostics',
    email: 'lab.sylhet.care@medflow.local',
    phone: '+8801614004003',
    address: 'Uposhohor, Sylhet, Bangladesh',
    labName: 'Sylhet Care Diagnostics',
    licenseNumber: 'DGHS-LAB-3003',
    accreditations: ['ISO 15189'],
    availableTests: ['CBC', 'CRP', 'Stool R/E', 'Urine R/E'],
  },
  {
    fullName: 'Khulna Advanced Lab',
    email: 'lab.khulna.advanced@medflow.local',
    phone: '+8801614004004',
    address: 'Boyra, Khulna, Bangladesh',
    labName: 'Khulna Advanced Lab',
    licenseNumber: 'DGHS-LAB-3004',
    accreditations: ['DGHS Registered'],
    availableTests: ['X-Ray Referral Panel', 'Vitamin D', 'Calcium', 'ESR'],
  },
  {
    fullName: 'Rajshahi Clinical Diagnostics',
    email: 'lab.rajshahi.clinical@medflow.local',
    phone: '+8801614004005',
    address: 'Laxmipur, Rajshahi, Bangladesh',
    labName: 'Rajshahi Clinical Diagnostics',
    licenseNumber: 'DGHS-LAB-3005',
    accreditations: ['ISO 15189', 'DGHS Registered'],
    availableTests: ['HbA1c', 'Fasting Glucose', 'TSH', 'Liver Function'],
  },
];

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
  const addDays = (base: Date, days: number) =>
    new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

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
        maxWait: 20_000,
        timeout: 60_000,
      },
    );

    await prisma.user.createMany({
      data: [
        ...patients.map((patient) => ({
          fullName: patient.fullName,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
          passwordHash,
          role: Role.PATIENT,
        })),
        ...doctors.map((doctor) => ({
          fullName: doctor.fullName,
          email: doctor.email,
          phone: doctor.phone,
          address: doctor.address,
          passwordHash,
          role: Role.DOCTOR,
        })),
        ...pharmacies.map((pharmacy) => ({
          fullName: pharmacy.fullName,
          email: pharmacy.email,
          phone: pharmacy.phone,
          address: pharmacy.address,
          passwordHash,
          role: Role.PHARMACY,
        })),
        ...labs.map((lab) => ({
          fullName: lab.fullName,
          email: lab.email,
          phone: lab.phone,
          address: lab.address,
          passwordHash,
          role: Role.DIAGNOSTIC,
        })),
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
      data: patients.map((patient) => ({
        patientId: getUserId(patient.email),
        gender: patient.gender,
        dateOfBirth: new Date(patient.dateOfBirth),
        phone: patient.phone,
        address: patient.address,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions,
        currentMedications: patient.currentMedications,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        emergencyContactRelation: patient.emergencyContactRelation,
      })),
    });

    await prisma.professionalProfile.createMany({
      data: [
        ...doctors.map((doctor) => ({
          userId: getUserId(doctor.email),
          gender: doctor.gender,
          dateOfBirth: new Date(doctor.dateOfBirth),
          specialization: doctor.specialization,
          licenseNumber: doctor.licenseNumber,
          degrees: doctor.degrees,
          certifications: doctor.certifications,
          yearsOfExperience: doctor.yearsOfExperience,
          about: doctor.about,
          clinicName: doctor.clinicName,
          clinicAddress: doctor.clinicAddress,
          clinicPhone: doctor.clinicPhone,
          availableTimeSlots: doctor.availableTimeSlots,
        })),
        ...pharmacies.map((pharmacy) => ({
          userId: getUserId(pharmacy.email),
          pharmacyName: pharmacy.pharmacyName,
          licenseNumber: pharmacy.licenseNumber,
          licenseAuthority: pharmacy.licenseAuthority,
        })),
        ...labs.map((lab) => ({
          userId: getUserId(lab.email),
          labName: lab.labName,
          licenseNumber: lab.licenseNumber,
          accreditations: lab.accreditations,
          availableTests: lab.availableTests,
        })),
      ],
    });

    const appointmentOne = await prisma.appointment.create({
      data: {
        patientId: getUserId('patient.ayesha@medflow.local'),
        doctorId: getUserId('doctor.farhana@medflow.local'),
        status: AppointmentStatus.CONFIRMED,
        scheduledAt: addDays(now, 2),
        reason: 'Blood pressure review and occasional chest discomfort',
        preferredDateFrom: addDays(now, 1),
        preferredDateTo: addDays(now, 3),
        preferredTimeNote: 'Morning preferred',
        requiresLab: false,
        labFlowLocked: false,
      },
    });

    const appointmentTwo = await prisma.appointment.create({
      data: {
        patientId: getUserId('patient.mehedi@medflow.local'),
        doctorId: getUserId('doctor.tanvir@medflow.local'),
        status: AppointmentStatus.EXAM_DONE,
        scheduledAt: addDays(now, -4),
        reason: 'Persistent eczema flare-up during hot weather',
        preferredDateFrom: addDays(now, -6),
        preferredDateTo: addDays(now, -4),
        preferredTimeNote: 'Evening preferred',
        requiresLab: true,
        labFlowLocked: false,
      },
    });

    const appointmentThree = await prisma.appointment.create({
      data: {
        patientId: getUserId('patient.nusrat@medflow.local'),
        doctorId: getUserId('doctor.nusreen@medflow.local'),
        status: AppointmentStatus.REQUESTED,
        scheduledAt: null,
        reason: 'Follow-up consultation for recurrent migraine and fatigue',
        preferredDateFrom: addDays(now, 4),
        preferredDateTo: addDays(now, 7),
        preferredTimeNote: 'Late afternoon preferred',
        requiresLab: false,
        labFlowLocked: false,
      },
    });

    const appointmentFour = await prisma.appointment.create({
      data: {
        patientId: getUserId('patient.farhan@medflow.local'),
        doctorId: getUserId('doctor.mahmudul@medflow.local'),
        status: AppointmentStatus.CONFIRMED,
        scheduledAt: addDays(now, 5),
        reason: 'Low back pain after long office hours',
        preferredDateFrom: addDays(now, 5),
        preferredDateTo: addDays(now, 6),
        preferredTimeNote: 'After office hours',
        requiresLab: true,
        labFlowLocked: false,
      },
    });

    const appointmentFive = await prisma.appointment.create({
      data: {
        patientId: getUserId('patient.sadia@medflow.local'),
        doctorId: getUserId('doctor.samiha@medflow.local'),
        status: AppointmentStatus.CLOSED,
        scheduledAt: addDays(now, -8),
        reason: 'Diabetes review and medication adjustment',
        preferredDateFrom: addDays(now, -10),
        preferredDateTo: addDays(now, -8),
        preferredTimeNote: 'Midday preferred',
        requiresLab: true,
        labFlowLocked: false,
      },
    });

    const mehediLabOrder = await prisma.labOrder.create({
      data: {
        appointmentId: appointmentTwo.id,
        diagnosticId: getUserId('lab.ctg.metro@medflow.local'),
        status: LabOrderStatus.ASSIGNED,
        tests: [{ title: 'Allergy Panel', description: 'Common environmental allergens panel' }],
      },
    });

    const sadiaLabOrder = await prisma.labOrder.create({
      data: {
        appointmentId: appointmentFive.id,
        diagnosticId: getUserId('lab.rajshahi.clinical@medflow.local'),
        status: LabOrderStatus.SENT,
        tests: [
          { title: 'HbA1c', description: 'Average blood glucose over 3 months' },
          { title: 'Fasting Glucose', description: 'Morning fasting blood sugar' },
        ],
      },
    });

    await prisma.labResult.createMany({
      data: [
        {
          labOrderId: sadiaLabOrder.id,
          fileUrl: 'https://example.com/reports/sadia-hba1c.pdf',
          fileMimeType: 'application/pdf',
          filePublicId: 'reports/sadia-hba1c',
          fileSizeBytes: 214532,
          uploadedAt: addDays(now, -7),
        },
        {
          labOrderId: sadiaLabOrder.id,
          fileUrl: 'https://example.com/reports/sadia-fasting-glucose.pdf',
          fileMimeType: 'application/pdf',
          filePublicId: 'reports/sadia-fasting-glucose',
          fileSizeBytes: 205410,
          uploadedAt: addDays(now, -7),
        },
      ],
    });

    await prisma.prescription.createMany({
      data: [
        {
          appointmentId: appointmentTwo.id,
          doctorId: getUserId('doctor.tanvir@medflow.local'),
          pharmacyId: getUserId('pharmacy.ctg.city@medflow.local'),
          notes: 'Avoid sweating triggers and use moisturizer multiple times daily.',
          diagnosis: 'Atopic dermatitis flare',
          instructions: 'Apply the cream on affected areas only. Review after 2 weeks.',
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
              frequency: 'At night',
              duration: '10 days',
              route: 'Oral',
            },
          ],
          status: PrescriptionStatus.SENT_TO_PHARMACY,
          documentUrl: 'https://example.com/prescriptions/mehedi-eczema.pdf',
          documentPublicId: 'prescriptions/mehedi-eczema',
          documentMimeType: 'application/pdf',
          documentVersion: 1,
        },
        {
          appointmentId: appointmentFive.id,
          doctorId: getUserId('doctor.samiha@medflow.local'),
          pharmacyId: getUserId('pharmacy.rajshahi.medipoint@medflow.local'),
          notes: 'Continue diet control and monitor fasting sugar twice weekly.',
          diagnosis: 'Type 2 diabetes mellitus',
          instructions: 'Take medicines after meals and return with sugar chart.',
          medications: [
            {
              name: 'Metformin',
              dosage: '500 mg',
              frequency: 'Twice daily',
              duration: '30 days',
              route: 'Oral',
            },
            {
              name: 'Gliclazide',
              dosage: '40 mg',
              frequency: 'Once daily',
              duration: '30 days',
              route: 'Oral',
            },
          ],
          status: PrescriptionStatus.SENT_TO_PATIENT,
          documentUrl: 'https://example.com/prescriptions/sadia-diabetes.pdf',
          documentPublicId: 'prescriptions/sadia-diabetes',
          documentMimeType: 'application/pdf',
          documentVersion: 1,
        },
      ],
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: getUserId('patient.ayesha@medflow.local'),
          type: NotificationType.APPOINTMENT_CALLED,
          message: 'Your cardiology appointment has been confirmed.',
          read: false,
          createdAt: addDays(now, -1),
        },
        {
          userId: getUserId('patient.mehedi@medflow.local'),
          type: NotificationType.LAB_ASSIGNED,
          message: 'A diagnostic lab has been assigned to your dermatology visit.',
          read: false,
          createdAt: addDays(now, -3),
        },
        {
          userId: getUserId('patient.sadia@medflow.local'),
          type: NotificationType.LAB_RESULT_UPLOADED,
          message: 'Your diabetes follow-up lab results are now available.',
          read: false,
          createdAt: addDays(now, -7),
        },
        {
          userId: getUserId('pharmacy.ctg.city@medflow.local'),
          type: NotificationType.PRESCRIPTION_READY,
          message: 'A new prescription is ready for dispensing.',
          read: false,
          createdAt: addDays(now, -3),
        },
        {
          userId: getUserId('lab.rajshahi.clinical@medflow.local'),
          type: NotificationType.LAB_RESULT_UPLOADED,
          message: 'Recent diabetes lab reports were uploaded successfully.',
          read: true,
          createdAt: addDays(now, -7),
        },
      ],
    });

    console.log('Bangladesh seed completed successfully.');
    console.log('Seeded users by role:', {
      patients: patients.length,
      doctors: doctors.length,
      pharmacies: pharmacies.length,
      diagnostics: labs.length,
    });
    console.log('Credentials unchanged for all seeded users: Password123!');
    console.log('Reference appointment IDs:', {
      appointmentOneId: appointmentOne.id,
      appointmentTwoId: appointmentTwo.id,
      appointmentThreeId: appointmentThree.id,
      appointmentFourId: appointmentFour.id,
      appointmentFiveId: appointmentFive.id,
      mehediLabOrderId: mehediLabOrder.id,
      sadiaLabOrderId: sadiaLabOrder.id,
    });
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error('Bangladesh seed failed:', error);
  process.exit(1);
});
