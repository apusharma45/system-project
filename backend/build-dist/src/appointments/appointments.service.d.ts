import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    private readonly notificationsService;
    private readonly auditService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, auditService: AuditService);
    createForPatient(patientId: string, dto: CreateAppointmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    listMine(userId: string, role: Role): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }[]>;
    confirmByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    callByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    markInVisitByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    markExamDoneByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    closeByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    cancelByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    cancelByPatient(patientId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        scheduledAt: Date;
        status: AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    private updateByDoctorTransition;
    private getAppointmentOrThrow;
    private assertDoctorOwnership;
    private transitionOrThrow;
    private assertCloseAllowed;
}
