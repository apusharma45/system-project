import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDoctorMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(doctorId: string) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
        professionalProfile: true,
      },
    });

    if (!doctor || doctor.role !== Role.DOCTOR) {
      throw new NotFoundException('Doctor not found');
    }

    return {
      doctor: {
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
        role: doctor.role,
        phone: doctor.phone,
        address: doctor.address,
        joinedAt: doctor.createdAt,
        profile: doctor.professionalProfile,
      },
    };
  }

  async updateMyProfile(doctorId: string, dto: UpdateDoctorMyProfileDto) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { id: true, role: true },
    });

    if (!doctor || doctor.role !== Role.DOCTOR) {
      throw new NotFoundException('Doctor not found');
    }

    await this.prisma.user.update({
      where: { id: doctorId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
      },
    });

    return this.getMyProfile(doctorId);
  }
}
