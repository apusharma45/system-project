import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePharmacyMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class PharmaciesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getPharmacyProfile(pharmacyId: string) {
    const pharmacy = await this.prisma.user.findUnique({
      where: { id: pharmacyId },
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

    if (!pharmacy || pharmacy.role !== Role.PHARMACY) {
      throw new NotFoundException('Pharmacy user not found');
    }

    return {
      pharmacy: {
        id: pharmacy.id,
        fullName: pharmacy.fullName,
        avatarUrl: pharmacy.avatarUrl,
        email: pharmacy.email,
        role: pharmacy.role,
        phone: pharmacy.phone,
        address: pharmacy.address,
        joinedAt: pharmacy.createdAt,
        profile: pharmacy.professionalProfile,
      },
    };
  }

  async getMyProfile(pharmacyId: string) {
    return this.getPharmacyProfile(pharmacyId);
  }

  async getProfileForAdmin(pharmacyId: string) {
    return this.getPharmacyProfile(pharmacyId);
  }

  private async updatePharmacyProfile(pharmacyId: string, dto: UpdatePharmacyMyProfileDto) {
    const pharmacy = await this.prisma.user.findUnique({
      where: { id: pharmacyId },
      select: { id: true, role: true },
    });

    if (!pharmacy || pharmacy.role !== Role.PHARMACY) {
      throw new NotFoundException('Pharmacy user not found');
    }

    const profileData = {
      ...(dto.licenseNumber !== undefined ? { licenseNumber: dto.licenseNumber } : {}),
      ...(dto.pharmacyName !== undefined ? { pharmacyName: dto.pharmacyName } : {}),
    };
    const hasProfileData = Object.keys(profileData).length > 0;

    await this.prisma.user.update({
      where: { id: pharmacyId },
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

    return this.getPharmacyProfile(pharmacyId);
  }

  async updateMyProfile(pharmacyId: string, dto: UpdatePharmacyMyProfileDto) {
    return this.updatePharmacyProfile(pharmacyId, dto);
  }

  async updateProfileForAdmin(pharmacyId: string, dto: UpdatePharmacyMyProfileDto) {
    return this.updatePharmacyProfile(pharmacyId, dto);
  }
}
