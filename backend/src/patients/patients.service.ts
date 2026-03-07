import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileForDoctor(doctorId: string, patientId: string) {
    const canAccess = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        patientId,
      },
      select: { id: true },
    });
    if (!canAccess) {
      throw new ForbiddenException('You are not allowed to view this patient profile');
    }

    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        patientProfile: true,
      },
    });

    if (!patient || patient.role !== Role.PATIENT) {
      throw new NotFoundException('Patient not found');
    }

    const db = this.prisma as any;
    const [appointments, labOrders, prescriptions] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { patientId },
        orderBy: { createdAt: 'desc' },
      }),
      db.labOrder.findMany({
        where: {
          appointment: {
            patientId,
          },
        },
        include: {
          appointment: true,
          labResult: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.prescription.findMany({
        where: {
          appointment: {
            patientId,
          },
        },
        include: {
          appointment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        joinedAt: patient.createdAt,
        profile: patient.patientProfile,
      },
      summary: {
        appointmentCount: appointments.length,
        labOrderCount: labOrders.length,
        prescriptionCount: prescriptions.length,
      },
      history: {
        appointments,
        labOrders,
        prescriptions,
      },
    };
  }
}
