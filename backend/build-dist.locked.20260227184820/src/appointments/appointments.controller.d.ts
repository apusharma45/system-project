import { Role } from '../../generated/prisma/client';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
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
        patientId: string;
        doctorId: string;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        scheduledAt: Date;
    }>;
    listMine(req: {
        user: RequestUser;
    }): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        scheduledAt: Date;
    }[]>;
    confirm(req: {
        user: RequestUser;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string;
        status: import("../../generated/prisma/enums").AppointmentStatus;
        scheduledAt: Date;
    }>;
}
export {};
