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
    }>;
    listMine(userId: string, role: Role): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
    }[]>;
    confirmByDoctor(doctorId: string, appointmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: AppointmentStatus;
        scheduledAt: Date;
    }>;
}
