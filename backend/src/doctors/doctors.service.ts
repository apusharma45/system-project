import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
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
        avatarUrl: true,
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
        avatarUrl: doctor.avatarUrl,
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

    const profileData = {
      ...(dto.licenseNumber !== undefined ? { licenseNumber: dto.licenseNumber } : {}),
      ...(dto.specialization !== undefined ? { specialization: dto.specialization } : {}),
      ...(dto.dateOfBirth !== undefined
        ? { dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null }
        : {}),
      ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
      ...(dto.about !== undefined ? { about: dto.about } : {}),
      ...(dto.clinicName !== undefined ? { clinicName: dto.clinicName } : {}),
      ...(dto.clinicAddress !== undefined ? { clinicAddress: dto.clinicAddress } : {}),
      ...(dto.clinicPhone !== undefined ? { clinicPhone: dto.clinicPhone } : {}),
      ...(dto.degrees !== undefined
        ? { degrees: dto.degrees as unknown as Prisma.InputJsonValue }
        : {}),
      ...(dto.certifications !== undefined
        ? { certifications: dto.certifications as unknown as Prisma.InputJsonValue }
        : {}),
      ...(dto.yearsOfExperience !== undefined ? { yearsOfExperience: dto.yearsOfExperience } : {}),
      ...(dto.availableTimeSlots !== undefined
        ? {
            availableTimeSlots: dto.availableTimeSlots.map((slot) => ({
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime,
            })) as unknown as Prisma.InputJsonValue,
          }
        : {}),
    };
    const hasProfileData = Object.keys(profileData).length > 0;

    await this.prisma.user.update({
      where: { id: doctorId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        ...(hasProfileData
          ? {
              professionalProfile: {
                upsert: {
                  create: profileData,
                  update: profileData,
                },
              },
            }
          : {}),
      },
    });

    return this.getMyProfile(doctorId);
  }
}
