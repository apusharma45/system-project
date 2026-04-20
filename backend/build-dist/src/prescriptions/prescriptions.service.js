"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const client_1 = require("../../generated/prisma/client");
const audit_service_1 = require("../audit/audit.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const TRANSITIONS = {
    DRAFT: [client_1.PrescriptionStatus.SIGNED],
    SIGNED: [client_1.PrescriptionStatus.SENT_TO_PATIENT],
    SENT_TO_PATIENT: [client_1.PrescriptionStatus.SENT_TO_PHARMACY],
    SENT_TO_PHARMACY: [client_1.PrescriptionStatus.DISPENSED],
    DISPENSED: [],
};
let PrescriptionsService = class PrescriptionsService {
    prisma;
    notificationsService;
    auditService;
    cloudinaryService;
    constructor(prisma, notificationsService, auditService, cloudinaryService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.auditService = auditService;
        this.cloudinaryService = cloudinaryService;
    }
    async createDraft(doctorId, dto) {
        const db = this.prisma;
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: dto.appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.ForbiddenException('You can only create prescriptions for your own appointments');
        }
        if (appointment.status !== client_1.AppointmentStatus.EXAM_DONE &&
            appointment.status !== client_1.AppointmentStatus.CLOSED) {
            throw new common_1.BadRequestException('Prescription can be created only when appointment is EXAM_DONE or CLOSED');
        }
        const pharmacy = await this.prisma.user.findUnique({
            where: { id: dto.pharmacyId },
            select: { id: true, role: true },
        });
        if (!pharmacy || pharmacy.role !== client_1.Role.PHARMACY) {
            throw new common_1.BadRequestException('pharmacyId must belong to a pharmacy user');
        }
        const prescription = await db.prescription.create({
            data: {
                appointmentId: dto.appointmentId,
                doctorId,
                pharmacyId: dto.pharmacyId,
                notes: dto.notes,
                diagnosis: dto.diagnosis ?? null,
                instructions: dto.instructions ?? null,
                medications: dto.medications ?? null,
            },
        });
        await this.auditService.record(doctorId, 'PRESCRIPTION_CREATED', 'Prescription', prescription.id, { appointmentId: dto.appointmentId, pharmacyId: dto.pharmacyId });
        return prescription;
    }
    async signByDoctor(doctorId, prescriptionId, dto) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.SIGNED);
        await this.assertLabDependencySatisfied(prescription.appointment);
        const prescriptionUpdated = await db.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: client_1.PrescriptionStatus.SIGNED,
                ...(dto?.notes ? { notes: dto.notes } : {}),
                ...(dto?.diagnosis !== undefined ? { diagnosis: dto.diagnosis } : {}),
                ...(dto?.instructions !== undefined ? { instructions: dto.instructions } : {}),
                ...(dto?.medications !== undefined ? { medications: dto.medications } : {}),
            },
        });
        await this.auditService.record(doctorId, 'PRESCRIPTION_SIGNED', 'Prescription', prescriptionId);
        return prescriptionUpdated;
    }
    async sendToPatientByDoctor(doctorId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.SENT_TO_PATIENT);
        const updated = await db.prescription.update({
            where: { id: prescriptionId },
            data: { status: client_1.PrescriptionStatus.SENT_TO_PATIENT },
        });
        await this.notificationsService.createAndEmit(prescription.appointment.patientId, client_1.NotificationType.PRESCRIPTION_READY, 'Your prescription is ready.', { prescriptionId }, doctorId);
        await this.auditService.record(doctorId, 'PRESCRIPTION_SENT_TO_PATIENT', 'Prescription', prescriptionId);
        return updated;
    }
    async sendToPharmacyByDoctor(doctorId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.SENT_TO_PHARMACY);
        const updated = await db.prescription.update({
            where: { id: prescriptionId },
            data: { status: client_1.PrescriptionStatus.SENT_TO_PHARMACY },
        });
        await this.notificationsService.createAndEmit(prescription.pharmacyId, client_1.NotificationType.PRESCRIPTION_READY, 'A prescription is ready for fulfillment.', { prescriptionId }, doctorId);
        await this.auditService.record(doctorId, 'PRESCRIPTION_SENT_TO_PHARMACY', 'Prescription', prescriptionId);
        return updated;
    }
    async dispenseByPharmacy(pharmacyId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        if (prescription.pharmacyId !== pharmacyId) {
            throw new common_1.ForbiddenException('You can only dispense prescriptions assigned to your pharmacy');
        }
        this.transitionOrThrow(prescription.status, client_1.PrescriptionStatus.DISPENSED);
        const dispensed = await db.prescription.update({
            where: { id: prescriptionId },
            data: { status: client_1.PrescriptionStatus.DISPENSED },
        });
        await this.auditService.record(pharmacyId, 'PRESCRIPTION_DISPENSED', 'Prescription', prescriptionId);
        return dispensed;
    }
    async uploadDocumentByDoctor(doctorId, prescriptionId, file) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionWithAppointmentOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        if (!file) {
            throw new common_1.BadRequestException('Prescription document file is required');
        }
        const allowedMime = /^application\/pdf$|^image\/(png|jpeg|jpg|webp)$/i.test(file.mimetype);
        if (!allowedMime) {
            throw new common_1.BadRequestException('Supported formats are PDF, PNG, JPG, or WEBP');
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new common_1.BadRequestException('Prescription document must be 10MB or less');
        }
        const upload = await this.cloudinaryService.uploadBuffer({
            buffer: file.buffer,
            fileName: file.originalname || `prescription-${prescription.id}`,
            folder: 'prescriptions',
            contentType: file.mimetype,
            resourceType: file.mimetype === 'application/pdf' ? 'raw' : 'image',
        });
        if (prescription.documentPublicId) {
            await this.cloudinaryService.destroy(prescription.documentPublicId, prescription.documentMimeType?.startsWith('image/') ? 'image' : 'raw');
        }
        const updated = await db.prescription.update({
            where: { id: prescriptionId },
            data: {
                documentUrl: upload.url,
                documentPublicId: upload.publicId,
                documentMimeType: upload.mimeType,
                documentVersion: (prescription.documentVersion ?? 0) + 1,
            },
        });
        await this.auditService.record(doctorId, 'PRESCRIPTION_DOCUMENT_UPLOADED', 'Prescription', prescriptionId, {
            documentPublicId: updated.documentPublicId,
            documentVersion: updated.documentVersion,
        });
        return updated;
    }
    async generateDocumentByDoctor(doctorId, prescriptionId) {
        const db = this.prisma;
        const prescription = await this.getPrescriptionForDocumentGenerationOrThrow(prescriptionId);
        this.assertDoctorOwnership(prescription.doctorId, doctorId);
        const pdfBuffer = await this.buildPrescriptionPdfBuffer(prescription);
        const upload = await this.cloudinaryService.uploadBuffer({
            buffer: pdfBuffer,
            fileName: `prescription-${prescription.id}.pdf`,
            folder: 'prescriptions',
            contentType: 'application/pdf',
            resourceType: 'raw',
        });
        if (prescription.documentPublicId) {
            await this.cloudinaryService.destroy(prescription.documentPublicId, prescription.documentMimeType?.startsWith('image/') ? 'image' : 'raw');
        }
        const updated = await db.prescription.update({
            where: { id: prescriptionId },
            data: {
                documentUrl: upload.url,
                documentPublicId: upload.publicId,
                documentMimeType: upload.mimeType,
                documentVersion: (prescription.documentVersion ?? 0) + 1,
            },
        });
        await this.auditService.record(doctorId, 'PRESCRIPTION_DOCUMENT_GENERATED', 'Prescription', prescriptionId, {
            documentPublicId: updated.documentPublicId,
            documentVersion: updated.documentVersion,
        });
        return updated;
    }
    listMine(userId, role) {
        const db = this.prisma;
        if (role === client_1.Role.DOCTOR) {
            return db.prescription.findMany({
                where: { doctorId: userId },
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
            }).then((items) => items.map((item) => this.withPharmacySnapshot(item)));
        }
        if (role === client_1.Role.PHARMACY) {
            return db.prescription.findMany({
                where: { pharmacyId: userId },
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
        }
        if (role === client_1.Role.PATIENT) {
            return db.prescription.findMany({
                where: {
                    appointment: { patientId: userId },
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
            }).then((items) => items.map((item) => this.withPharmacySnapshot(item)));
        }
        throw new common_1.ForbiddenException('Role cannot view prescriptions');
    }
    async getOne(userId, role, prescriptionId) {
        const db = this.prisma;
        const prescription = await db.prescription.findUnique({
            where: { id: prescriptionId },
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
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (role === client_1.Role.DOCTOR && prescription.doctorId === userId) {
            return this.withPharmacySnapshot(prescription);
        }
        if (role === client_1.Role.PHARMACY && prescription.pharmacyId === userId) {
            return prescription;
        }
        if (role === client_1.Role.PATIENT && prescription.appointment.patientId === userId) {
            return this.withPharmacySnapshot(prescription);
        }
        throw new common_1.ForbiddenException('You are not allowed to access this prescription');
    }
    async getPrescriptionWithAppointmentOrThrow(prescriptionId) {
        const db = this.prisma;
        const prescription = await db.prescription.findUnique({
            where: { id: prescriptionId },
            include: { appointment: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return prescription;
    }
    async getPrescriptionForDocumentGenerationOrThrow(prescriptionId) {
        const db = this.prisma;
        const prescription = await db.prescription.findUnique({
            where: { id: prescriptionId },
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
                pharmacy: {
                    select: {
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
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return prescription;
    }
    assertDoctorOwnership(doctorIdInPrescription, doctorId) {
        if (doctorIdInPrescription !== doctorId) {
            throw new common_1.ForbiddenException('You can only modify your own prescriptions');
        }
    }
    transitionOrThrow(current, next) {
        if (!TRANSITIONS[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid transition: ${current} -> ${next}`);
        }
    }
    async assertLabDependencySatisfied(appointment) {
        if (!appointment.requiresLab) {
            return;
        }
        if (appointment.labFlowLocked) {
            throw new common_1.BadRequestException('Cannot sign prescription while lab workflow is pending');
        }
        const db = this.prisma;
        const result = await db.labResult.findFirst({
            where: {
                labOrder: {
                    appointmentId: appointment.id,
                },
            },
        });
        if (!result) {
            throw new common_1.BadRequestException('Cannot sign prescription before lab result is uploaded');
        }
    }
    withPharmacySnapshot(prescription) {
        const snapshot = this.getPharmacySnapshot(prescription);
        return {
            ...prescription,
            pharmacySnapshot: snapshot,
        };
    }
    getPharmacySnapshot(prescription) {
        const pharmacyName = prescription.pharmacy?.professionalProfile?.pharmacyName ?? null;
        const fullName = prescription.pharmacy?.fullName ?? null;
        const email = prescription.pharmacy?.email ?? null;
        const address = prescription.pharmacy?.address ?? null;
        const phone = prescription.pharmacy?.phone ?? null;
        const name = pharmacyName ?? fullName ?? email ?? 'Not assigned';
        return {
            id: prescription.pharmacyId,
            name,
            pharmacyName,
            fullName,
            email,
            address,
            phone,
        };
    }
    buildPrescriptionPdfBuffer(prescription) {
        const meds = Array.isArray(prescription.medications) ? prescription.medications : [];
        const doctorName = prescription.appointment?.doctor?.fullName ||
            prescription.appointment?.doctor?.email ||
            'Unknown doctor';
        const patientName = prescription.appointment?.patient?.fullName ||
            prescription.appointment?.patient?.email ||
            'Unknown patient';
        const pharmacyName = prescription.pharmacy?.professionalProfile?.pharmacyName ||
            prescription.pharmacy?.fullName ||
            prescription.pharmacy?.email ||
            'Not assigned';
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: 'A4', margin: 48 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(18).text('Prescription');
            doc.moveDown(0.5);
            doc.fontSize(11);
            doc.text(`Prescription ID: ${prescription.id}`);
            doc.text(`Appointment ID: ${prescription.appointmentId}`);
            doc.text(`Doctor: ${doctorName}`);
            doc.text(`Patient: ${patientName}`);
            doc.text(`Status: ${prescription.status}`);
            doc.moveDown(0.5);
            doc.text(`Diagnosis: ${prescription.diagnosis || 'Not provided'}`);
            doc.text(`Instructions: ${prescription.instructions || 'Not provided'}`);
            doc.text(`Doctor Advice: ${prescription.notes || 'Not provided'}`);
            doc.moveDown(0.5);
            doc.text(`Pharmacy: ${pharmacyName}`);
            doc.text(`Pharmacy Address: ${prescription.pharmacy?.address || 'Not provided'}`);
            doc.text(`Pharmacy Phone: ${prescription.pharmacy?.phone || 'Not provided'}`);
            doc.moveDown(0.8);
            doc.fontSize(13).text('Medications');
            doc.fontSize(11);
            if (meds.length) {
                meds.forEach((med, idx) => {
                    doc.text(`${idx + 1}. ${med?.name || 'Unnamed'}`);
                    doc.text(`   Dosage: ${med?.dosage || 'Not provided'}`);
                    doc.text(`   Frequency: ${med?.frequency || 'Not provided'}`);
                    doc.text(`   Duration: ${med?.duration || 'Not provided'}`);
                    doc.text(`   Route: ${med?.route || 'Not provided'}`);
                    doc.moveDown(0.2);
                });
            }
            else {
                doc.text('- No medications listed');
            }
            doc.end();
        });
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        audit_service_1.AuditService,
        cloudinary_service_1.CloudinaryService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map