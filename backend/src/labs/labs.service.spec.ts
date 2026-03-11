import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { LabsService } from './labs.service';

describe('LabsService', () => {
  let service: LabsService;
  const sampleTests = [{ title: 'Test 1', description: 'CBC panel' }];
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    labOrder: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    labResult: {
      create: jest.fn(),
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
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabsService,
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

    service = module.get<LabsService>(LabsService);
  });

  it('createOrder creates a lab order and locks appointment lab flow', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      patientId: 'p1',
      status: AppointmentStatus.IN_VISIT,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag1',
      role: Role.DIAGNOSTIC,
      fullName: 'City Diagnostic',
      email: 'diag@example.com',
      phone: '+8801700000003',
      address: 'Dhaka',
      professionalProfile: {
        labName: 'City Diagnostic Lab',
      },
    });
    prismaMock.labOrder.create.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    const result = await service.createOrder('d1', {
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      tests: sampleTests,
    });

    expect(prismaMock.labOrder.create).toHaveBeenCalledWith({
      data: {
        appointmentId: 'a1',
        diagnosticId: 'diag1',
        tests: sampleTests,
      },
    });

    expect(prismaMock.appointment.update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: { requiresLab: true, labFlowLocked: true },
    });
    expect(notificationsMock.createAndEmit).toHaveBeenCalledWith(
      'p1',
      'LAB_ASSIGNED',
      expect.stringContaining('Lab assigned: City Diagnostic Lab.'),
      expect.objectContaining({
        appointmentId: 'a1',
        labOrderId: 'o1',
        diagnosticId: 'diag1',
        diagnosticName: 'City Diagnostic Lab',
        diagnosticAddress: 'Dhaka',
        diagnosticPhone: '+8801700000003',
      }),
      'd1',
    );
    expect(result.status).toBe('CREATED');
  });

  it('createOrder allows multiple lab orders for the same appointment', async () => {
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'd1',
      patientId: 'p1',
      status: AppointmentStatus.EXAM_DONE,
    });
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'diag1',
      role: Role.DIAGNOSTIC,
      fullName: null,
      email: 'diag@example.com',
      phone: null,
      address: null,
      professionalProfile: {
        labName: null,
      },
    });
    prismaMock.labOrder.create.mockResolvedValueOnce({
      id: 'o2',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    const result = await service.createOrder('d1', {
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      tests: sampleTests,
    });

    expect(result.id).toBe('o2');
  });

  it('uploadResult accepts multiple files and auto-completes to SENT', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'doc1',
      patientId: 'pat1',
    });
    cloudinaryMock.uploadBuffer
      .mockResolvedValueOnce({
        url: 'https://cloudinary.test/report-1.pdf',
        publicId: 'lab-reports/o1/report-1',
        version: 1,
        mimeType: 'application/pdf',
        bytes: 1200,
      })
      .mockResolvedValueOnce({
        url: 'https://cloudinary.test/report-2.pdf',
        publicId: 'lab-reports/o1/report-2',
        version: 1,
        mimeType: 'application/pdf',
        bytes: 1400,
      });
    prismaMock.labOrder.update.mockResolvedValueOnce({
      id: 'o1',
      status: 'SENT',
    });
    prismaMock.labResult.create
      .mockResolvedValueOnce({
        id: 'r1',
        labOrderId: 'o1',
        fileUrl: 'https://cloudinary.test/report-1.pdf',
      })
      .mockResolvedValueOnce({
        id: 'r2',
        labOrderId: 'o1',
        fileUrl: 'https://cloudinary.test/report-2.pdf',
      });
    prismaMock.labOrder.findFirst.mockResolvedValueOnce(null);

    const result = await service.uploadResult('diag1', 'o1', [
      {
        originalname: 'report-1.pdf',
        mimetype: 'application/pdf',
        size: 1200,
        buffer: Buffer.from('pdf-1'),
      },
      {
        originalname: 'report-2.pdf',
        mimetype: 'application/pdf',
        size: 1400,
        buffer: Buffer.from('pdf-2'),
      },
    ]);

    expect(result.uploadedCount).toBe(2);
    expect(prismaMock.labOrder.update).toHaveBeenCalledWith({
      where: { id: 'o1' },
      data: { status: 'SENT' },
    });
    expect(notificationsMock.createAndEmit).toHaveBeenCalledTimes(4);
  });

  it('uploadResult allows additional uploads after SENT without changing status', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'SENT',
    });
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'doc1',
      patientId: 'pat1',
    });
    cloudinaryMock.uploadBuffer.mockResolvedValueOnce({
      url: 'https://cloudinary.test/report-v2.pdf',
      publicId: 'lab-reports/o1/report-v2',
      version: 1,
      mimeType: 'application/pdf',
      bytes: 1300,
    });
    prismaMock.labResult.create.mockResolvedValueOnce({
      id: 'r3',
      labOrderId: 'o1',
      fileUrl: 'https://cloudinary.test/report-v2.pdf',
    });
    prismaMock.labOrder.findFirst.mockResolvedValueOnce(null);

    await service.uploadResult('diag1', 'o1', [
      {
        originalname: 'report-v2.pdf',
        mimetype: 'application/pdf',
        size: 1300,
        buffer: Buffer.from('pdf-v2'),
      },
    ]);

    expect(prismaMock.labOrder.update).not.toHaveBeenCalled();
  });

  it('uploadResult rejects when no files provided', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    await expect(service.uploadResult('diag1', 'o1', [])).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('uploadResult rejects invalid file mime type', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'CREATED',
    });

    await expect(
      service.uploadResult('diag1', 'o1', [
        {
          originalname: 'report.txt',
          mimetype: 'text/plain',
          size: 100,
          buffer: Buffer.from('txt'),
        },
      ]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('uploadResult keeps appointment locked when other lab orders have no reports', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      appointmentId: 'a1',
      diagnosticId: 'diag1',
      status: 'SAMPLE_COLLECTED',
    });
    prismaMock.appointment.findUnique.mockResolvedValueOnce({
      id: 'a1',
      doctorId: 'doc1',
      patientId: 'pat1',
    });
    cloudinaryMock.uploadBuffer.mockResolvedValueOnce({
      url: 'https://cloudinary.test/report.pdf',
      publicId: 'lab-reports/o1/report-1',
      version: 1,
      mimeType: 'application/pdf',
      bytes: 1234,
    });
    prismaMock.labOrder.update.mockResolvedValueOnce({
      id: 'o1',
      status: 'SENT',
    });
    prismaMock.labResult.create.mockResolvedValueOnce({
      id: 'r1',
      labOrderId: 'o1',
      fileUrl: 'https://cloudinary.test/report.pdf',
    });
    prismaMock.labOrder.findFirst.mockResolvedValueOnce({ id: 'o2' });

    await service.uploadResult('diag1', 'o1', [
      {
        originalname: 'report.pdf',
        mimetype: 'application/pdf',
        size: 1234,
        buffer: Buffer.from('pdf'),
      },
    ]);

    expect(prismaMock.appointment.update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: { labFlowLocked: true },
    });
  });

  it('markSent enforces SAMPLE_COLLECTED -> SENT', async () => {
    prismaMock.labOrder.findUnique.mockResolvedValueOnce({
      id: 'o1',
      diagnosticId: 'diag1',
      status: 'SAMPLE_COLLECTED',
    });
    prismaMock.labOrder.update.mockResolvedValueOnce({
      id: 'o1',
      status: 'SENT',
    });

    const result = await service.markSent('diag1', 'o1');
    expect(result.status).toBe('SENT');
  });

  it('listMine filters by role and rejects unsupported roles', async () => {
    prismaMock.labOrder.findMany.mockResolvedValue([]);
    await service.listMine('u1', Role.DOCTOR);
    await service.listMine('u1', Role.PATIENT);
    await service.listMine('u1', Role.DIAGNOSTIC);

    await expect(service.listMine('u1', Role.ADMIN)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prismaMock.labOrder.findMany).toHaveBeenCalledTimes(3);
  });

  it('listMine includes patient diagnostic snapshot fields for patient role', async () => {
    prismaMock.labOrder.findMany.mockResolvedValueOnce([
      {
        id: 'o1',
        appointmentId: 'a1',
        diagnosticId: 'diag1',
        status: 'SENT',
        appointment: { id: 'a1' },
        diagnostic: {
          fullName: 'Central Diagnostics',
          email: 'central@example.com',
          phone: '+8801700000099',
          address: 'Banani',
          professionalProfile: { labName: 'Central Diagnostic Lab' },
        },
        labReports: [],
      },
    ]);

    const result = await service.listMine('u1', Role.PATIENT);
    expect(result[0].diagnosticSnapshot).toEqual({
      name: 'Central Diagnostic Lab',
      address: 'Banani',
      phone: '+8801700000099',
    });
  });

  it('getResult enforces role-based access and returns latest report', async () => {
    prismaMock.labOrder.findUnique
      .mockResolvedValueOnce({
        id: 'o1',
        diagnosticId: 'diag1',
        appointment: { doctorId: 'doc1', patientId: 'pat1' },
        labReports: [
          { id: 'r2', labOrderId: 'o1', uploadedAt: new Date('2026-01-02') },
          { id: 'r1', labOrderId: 'o1', uploadedAt: new Date('2026-01-01') },
        ],
      })
      .mockResolvedValueOnce({
        id: 'o1',
        diagnosticId: 'diag1',
        appointment: { doctorId: 'doc1', patientId: 'pat1' },
        labReports: [{ id: 'r2', labOrderId: 'o1' }],
      });

    const allowed = await service.getResult('doc1', Role.DOCTOR, 'o1');
    expect(allowed.id).toBe('r2');

    await expect(service.getResult('other', Role.DOCTOR, 'o1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws not found when order or reports are missing', async () => {
    prismaMock.labOrder.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'o1',
        diagnosticId: 'diag1',
        appointment: { doctorId: 'doc1', patientId: 'pat1' },
        labReports: [],
      });

    await expect(service.getResult('doc1', Role.DOCTOR, 'o1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.getResult('doc1', Role.DOCTOR, 'o1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
