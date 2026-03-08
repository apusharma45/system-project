import { Role } from '../../generated/prisma/client';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ScheduleAppointmentDto } from './dto/schedule-appointment.dto';
type RequestUser = {
    userId: string;
    role: Role;
};
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(req: {
        user: RequestUser;
    }, dto: CreateAppointmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    listMine(req: {
        user: RequestUser;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }[]>;
    confirm(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    schedule(req: {
        user: RequestUser;
    }, id: string, dto: ScheduleAppointmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    call(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    markInVisit(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    markExamDone(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    close(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
    cancel(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        preferredDateFrom: Date | null;
        preferredDateTo: Date | null;
        reason: string | null;
        preferredTimeNote: string | null;
        scheduledAt: Date | null;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        requiresLab: boolean;
        labFlowLocked: boolean;
        patientId: string;
    }>;
}
export {};
