import { AppointmentStatus, Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createForPatient(patientId: string, dto: CreateAppointmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    listMine(userId: string, role: Role): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }[]>;
    confirmByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    callByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    markInVisitByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    markExamDoneByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    closeByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    cancelByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    cancelByPatient(patientId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
        requiresLab: boolean;
        labFlowLocked: boolean;
    }>;
    private updateByDoctorTransition;
    private getAppointmentOrThrow;
    private assertDoctorOwnership;
    private transitionOrThrow;
    private assertCloseAllowed;
}
