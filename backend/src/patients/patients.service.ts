import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(patientId: string) {
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        patientProfile: true,
      },
    });

    if (!patient || patient.role !== Role.PATIENT) {
      throw new NotFoundException('Patient not found');
    }

    return {
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        avatarUrl: patient.avatarUrl,
        email: patient.email,
        role: patient.role,
        phone: patient.phone,
        address: patient.address,
        joinedAt: patient.createdAt,
        profile: patient.patientProfile,
      },
    };
  }

  async updateMyProfile(patientId: string, dto: UpdateMyProfileDto) {
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: { id: true, role: true },
    });

    if (!patient || patient.role !== Role.PATIENT) {
      throw new NotFoundException('Patient not found');
    }

    const profileUpdateData: Record<string, string> = {};
    if (dto.allergies !== undefined) profileUpdateData.allergies = dto.allergies;
    if (dto.chronicConditions !== undefined)
      profileUpdateData.chronicConditions = dto.chronicConditions;
    if (dto.currentMedications !== undefined)
      profileUpdateData.currentMedications = dto.currentMedications;
    if (dto.emergencyContactName !== undefined)
      profileUpdateData.emergencyContactName = dto.emergencyContactName;
    if (dto.emergencyContactPhone !== undefined)
      profileUpdateData.emergencyContactPhone = dto.emergencyContactPhone;
    if (dto.emergencyContactRelation !== undefined)
      profileUpdateData.emergencyContactRelation = dto.emergencyContactRelation;

    await this.prisma.user.update({
      where: { id: patientId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        patientProfile:
          Object.keys(profileUpdateData).length > 0
            ? {
                upsert: {
                  create: profileUpdateData,
                  update: profileUpdateData,
                },
              }
            : undefined,
      },
    });

    return this.getMyProfile(patientId);
  }

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
        avatarUrl: true,
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
          labReports: { orderBy: { uploadedAt: 'desc' } },
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
        avatarUrl: patient.avatarUrl,
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
        labOrders: labOrders.map((item: any) => ({
          ...item,
          latestReport: item.labReports?.[0] ?? null,
          labResult: item.labReports?.[0] ?? null,
        })),
        prescriptions,
      },
    };
  }
}
