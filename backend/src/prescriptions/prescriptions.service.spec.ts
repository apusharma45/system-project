import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus, PrescriptionStatus, Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrescriptionsService } from './prescriptions.service';

describe('PrescriptionsService', () => {
  let service: PrescriptionsService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
    },
    prescription: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    labResult: {
      findFirst: jest.fn(),
    },
  };
  const notificationsMock = {
    createAndEmit: jest.fn(),
  };
  const auditMock = {
    record: jest.fn(),
  };
  const cloudinaryMock = {
    uploadBuffer: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: NotificationsService,
          useValue: notificationsMock,
        },
        {
          provide: AuditService,
          useValue: auditMock,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryMock,
        },
      ],
    }).compile();

    service = module.get<PrescriptionsService>(PrescriptionsService);
  });

  it('uploadDocumentByDoctor uploads document and stores metadata', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx1',
      appointmentId: 'a1',
      doctorId: 'd1',
      documentVersion: 0,
      documentPublicId: null,
      appointment: { patientId: 'pt1' },
    });
    cloudinaryMock.uploadBuffer.mockResolvedValueOnce({
      url: 'https://example.com/rx1.png',
      publicId: 'prescriptions/rx1',
      version: 2,
      mimeType: 'image/png',
      bytes: 2000,
    });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      documentUrl: 'https://example.com/rx1.png',
      documentPublicId: 'prescriptions/rx1',
      documentVersion: 1,
    });

    const result = await service.uploadDocumentByDoctor('d1', 'rx1', {
      buffer: Buffer.from('abc'),
      mimetype: 'image/png',
      originalname: 'rx.png',
      size: 3,
    } as any);

    expect(cloudinaryMock.uploadBuffer).toHaveBeenCalledTimes(1);
    expect(prismaMock.prescription.update).toHaveBeenCalledWith({
      where: { id: 'rx1' },
      data: {
        documentUrl: 'https://example.com/rx1.png',
        documentPublicId: 'prescriptions/rx1',
        documentMimeType: 'image/png',
        documentVersion: 1,
      },
    });
    expect(result.documentPublicId).toBe('prescriptions/rx1');
  });

  it('createDraft creates a draft for valid doctor appointment and pharmacy', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'p1',
      role: Role.PHARMACY,
    });
    prismaMock.prescription.create.mockResolvedValueOnce({
      id: 'rx1',
      appointmentId: 'a1',
      doctorId: 'd1',
      pharmacyId: 'p1',
      notes: 'Take once daily',
      status: PrescriptionStatus.DRAFT,
    });

    const result = await service.createDraft('d1', {
      appointmentId: 'a1',
      pharmacyId: 'p1',
      notes: 'Take once daily',
    });
    expect(result.status).toBe(PrescriptionStatus.DRAFT);
  });

  it('createDraft allows multiple prescriptions for the same appointment', async () => {
    prismaMock.appointment.findUnique.mockResolvedValue({
      id: 'a1',
      doctorId: 'd1',
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'p1',
      role: Role.PHARMACY,
    });
    prismaMock.prescription.create
      .mockResolvedValueOnce({
        id: 'rx1',
        appointmentId: 'a1',
        doctorId: 'd1',
        pharmacyId: 'p1',
        notes: 'dose 1',
        status: PrescriptionStatus.DRAFT,
      })
      .mockResolvedValueOnce({
        id: 'rx2',
        appointmentId: 'a1',
        doctorId: 'd1',
        pharmacyId: 'p1',
        notes: 'dose 2',
        status: PrescriptionStatus.DRAFT,
      });

    const first = await service.createDraft('d1', {
      appointmentId: 'a1',
      pharmacyId: 'p1',
      notes: 'dose 1',
    });
    const second = await service.createDraft('d1', {
      appointmentId: 'a1',
      pharmacyId: 'p1',
      notes: 'dose 2',
    });

    expect(first.id).toBe('rx1');
    expect(second.id).toBe('rx2');
    expect(prismaMock.prescription.create).toHaveBeenCalledTimes(2);
  });

  it('generateDocumentByDoctor creates pdf document and updates metadata', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx1',
      appointmentId: 'a1',
      doctorId: 'd1',
      status: PrescriptionStatus.SIGNED,
      notes: 'Take after meal',
      diagnosis: 'Hypertension',
      instructions: 'Morning and evening',
      medications: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'BID', duration: '30 days' }],
      documentVersion: 0,
      documentPublicId: null,
      documentMimeType: null,
      appointment: {
        patient: { fullName: 'John Doe', email: 'john@example.com' },
        doctor: { fullName: 'Dr. Alice', email: 'alice@example.com' },
      },
      pharmacy: {
        fullName: 'Prime Rx',
        email: 'prime@example.com',
        address: 'Dhaka',
        phone: '+8801700000002',
        professionalProfile: { pharmacyName: 'Prime Pharmacy' },
      },
    });
    cloudinaryMock.uploadBuffer.mockResolvedValueOnce({
      url: 'https://example.com/rx1.pdf',
      publicId: 'prescriptions/rx1.pdf',
      version: 3,
      mimeType: 'application/pdf',
      bytes: 4096,
    });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      documentUrl: 'https://example.com/rx1.pdf',
      documentPublicId: 'prescriptions/rx1.pdf',
      documentVersion: 1,
      documentMimeType: 'application/pdf',
    });

    const result = await service.generateDocumentByDoctor('d1', 'rx1');

    expect(cloudinaryMock.uploadBuffer).toHaveBeenCalledWith(
      expect.objectContaining({
        contentType: 'application/pdf',
        resourceType: 'raw',
      }),
    );
    expect(prismaMock.prescription.update).toHaveBeenCalledWith({
      where: { id: 'rx1' },
      data: {
        documentUrl: 'https://example.com/rx1.pdf',
        documentPublicId: 'prescriptions/rx1.pdf',
        documentMimeType: 'application/pdf',
        documentVersion: 1,
      },
    });
    expect(result.documentMimeType).toBe('application/pdf');
  });

  it('generateDocumentByDoctor replaces existing stored document', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx2',
      appointmentId: 'a2',
      doctorId: 'd1',
      status: PrescriptionStatus.SIGNED,
      notes: 'Use as prescribed',
      diagnosis: null,
      instructions: null,
      medications: [],
      documentVersion: 2,
      documentPublicId: 'prescriptions/old-rx2.pdf',
      documentMimeType: 'application/pdf',
      appointment: {
        patient: { fullName: 'Jane Doe', email: 'jane@example.com' },
        doctor: { fullName: 'Dr. Alice', email: 'alice@example.com' },
      },
      pharmacy: {
        fullName: 'Prime Rx',
        email: 'prime@example.com',
        address: null,
        phone: null,
        professionalProfile: { pharmacyName: 'Prime Pharmacy' },
      },
    });
    cloudinaryMock.uploadBuffer.mockResolvedValueOnce({
      url: 'https://example.com/rx2.pdf',
      publicId: 'prescriptions/rx2.pdf',
      version: 4,
      mimeType: 'application/pdf',
      bytes: 2048,
    });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx2',
      documentUrl: 'https://example.com/rx2.pdf',
      documentPublicId: 'prescriptions/rx2.pdf',
      documentVersion: 3,
      documentMimeType: 'application/pdf',
    });

    await service.generateDocumentByDoctor('d1', 'rx2');

    expect(cloudinaryMock.destroy).toHaveBeenCalledWith('prescriptions/old-rx2.pdf', 'raw');
  });

  it('createDraft rejects invalid ownership/state/pharmacy', async () => {
    prismaMock.appointment.findUnique
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'other',
        status: AppointmentStatus.EXAM_DONE,
      })
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'd1',
        status: AppointmentStatus.IN_VISIT,
      })
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'd1',
        status: AppointmentStatus.CLOSED,
      })
      .mockResolvedValueOnce({
        id: 'a1',
        doctorId: 'd1',
        status: AppointmentStatus.CLOSED,
      });
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: 'p1',
        role: Role.PATIENT,
      })
      .mockResolvedValueOnce({
        id: 'p1',
        role: Role.PHARMACY,
      });

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      service.createDraft('d1', {
        appointmentId: 'a1',
        pharmacyId: 'p1',
        notes: 'n',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

  });

  it('signByDoctor allows no-lab appointments', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx1',
      doctorId: 'd1',
      status: PrescriptionStatus.DRAFT,
      appointment: { id: 'a1', requiresLab: false, labFlowLocked: false },
    });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      status: PrescriptionStatus.SIGNED,
      notes: 'updated',
    });

    const result = await service.signByDoctor('d1', 'rx1', { notes: 'updated' });
    expect(result.status).toBe(PrescriptionStatus.SIGNED);
  });

  it('signByDoctor enforces conditional lab dependency and transition validity', async () => {
    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.DRAFT,
        appointment: { id: 'a1', requiresLab: true, labFlowLocked: true },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.DRAFT,
        appointment: { id: 'a1', requiresLab: true, labFlowLocked: false },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.SIGNED,
        appointment: { id: 'a1', requiresLab: false, labFlowLocked: false },
      });
    prismaMock.labResult.findFirst.mockResolvedValueOnce(null);

    await expect(service.signByDoctor('d1', 'rx1')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.signByDoctor('d1', 'rx1')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.signByDoctor('d1', 'rx1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('signByDoctor allows required-lab appointment when result exists', async () => {
    prismaMock.prescription.findUnique.mockResolvedValueOnce({
      id: 'rx1',
      doctorId: 'd1',
      status: PrescriptionStatus.DRAFT,
      appointment: { id: 'a1', requiresLab: true, labFlowLocked: false },
    });
    prismaMock.labResult.findFirst.mockResolvedValueOnce({ id: 'r1' });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      status: PrescriptionStatus.SIGNED,
    });

    const result = await service.signByDoctor('d1', 'rx1');
    expect(result.status).toBe(PrescriptionStatus.SIGNED);
  });

  it('doctor transitions follow SIGNED -> SENT_TO_PATIENT -> SENT_TO_PHARMACY', async () => {
    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.SIGNED,
        appointment: { id: 'a1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        status: PrescriptionStatus.SENT_TO_PATIENT,
        appointment: { id: 'a1' },
      });
    prismaMock.prescription.update
      .mockResolvedValueOnce({
        id: 'rx1',
        status: PrescriptionStatus.SENT_TO_PATIENT,
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
      });

    const one = await service.sendToPatientByDoctor('d1', 'rx1');
    const two = await service.sendToPharmacyByDoctor('d1', 'rx1');
    expect(one.status).toBe(PrescriptionStatus.SENT_TO_PATIENT);
    expect(two.status).toBe(PrescriptionStatus.SENT_TO_PHARMACY);
    expect(notificationsMock.createAndEmit).toHaveBeenCalledTimes(2);
    expect(auditMock.record).toHaveBeenCalled();
  });

  it('dispenseByPharmacy allows assigned pharmacy and rejects others/invalid state', async () => {
    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
        appointment: { id: 'a1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PATIENT,
        appointment: { id: 'a1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
        appointment: { id: 'a1' },
      });
    prismaMock.prescription.update.mockResolvedValueOnce({
      id: 'rx1',
      status: PrescriptionStatus.DISPENSED,
    });

    const ok = await service.dispenseByPharmacy('ph1', 'rx1');
    expect(ok.status).toBe(PrescriptionStatus.DISPENSED);

    await expect(service.dispenseByPharmacy('ph1', 'rx1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(service.dispenseByPharmacy('ph2', 'rx1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('listMine queries by role and getOne enforces access', async () => {
    prismaMock.prescription.findMany.mockResolvedValue([]);
    await service.listMine('d1', Role.DOCTOR);
    await service.listMine('p1', Role.PHARMACY);
    await service.listMine('u1', Role.PATIENT);
    expect(prismaMock.prescription.findMany).toHaveBeenCalledTimes(3);
    expect(prismaMock.prescription.findMany).toHaveBeenNthCalledWith(1, {
      where: { doctorId: 'd1' },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        pharmacy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            professionalProfile: {
              select: {
                pharmacyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(prismaMock.prescription.findMany).toHaveBeenNthCalledWith(2, {
      where: {
        pharmacyId: 'p1',
        status: {
          in: [PrescriptionStatus.SENT_TO_PHARMACY, PrescriptionStatus.DISPENSED],
        },
      },
      include: {
        appointment: {
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            doctor: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(prismaMock.prescription.findMany).toHaveBeenNthCalledWith(3, {
      where: {
        appointment: { patientId: 'u1' },
      },
      include: {
        appointment: true,
        pharmacy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            address: true,
            phone: true,
            professionalProfile: {
              select: {
                pharmacyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(() => service.listMine('u1', Role.ADMIN)).toThrow(ForbiddenException);

    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        pharmacy: {
          id: 'ph1',
          fullName: 'Prime Rx',
          email: 'prime@example.com',
          professionalProfile: { pharmacyName: 'Prime Pharmacy' },
        },
        appointment: { patientId: 'pt1' },
      })
      .mockResolvedValueOnce({
        id: 'rx1',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        appointment: { patientId: 'pt1' },
      })
      .mockResolvedValueOnce(null);

    const allowed = await service.getOne('d1', Role.DOCTOR, 'rx1');
    expect(allowed.id).toBe('rx1');
    expect(allowed.pharmacySnapshot).toEqual({
      id: 'ph1',
      name: 'Prime Pharmacy',
      pharmacyName: 'Prime Pharmacy',
      fullName: 'Prime Rx',
      email: 'prime@example.com',
      address: null,
      phone: null,
    });
    await expect(service.getOne('other', Role.DOCTOR, 'rx1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    await expect(service.getOne('d1', Role.DOCTOR, 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    prismaMock.prescription.findUnique
      .mockResolvedValueOnce({
        id: 'rx2',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SENT_TO_PHARMACY,
        appointment: { patientId: 'pt1' },
      })
      .mockResolvedValueOnce({
        id: 'rx3',
        doctorId: 'd1',
        pharmacyId: 'ph1',
        status: PrescriptionStatus.SIGNED,
        appointment: { patientId: 'pt1' },
      });

    await expect(service.getOne('ph1', Role.PHARMACY, 'rx2')).resolves.toMatchObject({
      id: 'rx2',
      status: PrescriptionStatus.SENT_TO_PHARMACY,
    });
    await expect(service.getOne('ph1', Role.PHARMACY, 'rx3')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
