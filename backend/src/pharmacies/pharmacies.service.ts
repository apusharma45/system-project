import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePharmacyMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class PharmaciesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(pharmacyId: string) {
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

  async updateMyProfile(pharmacyId: string, dto: UpdatePharmacyMyProfileDto) {
    const pharmacy = await this.prisma.user.findUnique({
      where: { id: pharmacyId },
      select: { id: true, role: true },
    });

    if (!pharmacy || pharmacy.role !== Role.PHARMACY) {
      throw new NotFoundException('Pharmacy user not found');
    }

    await this.prisma.user.update({
      where: { id: pharmacyId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
      },
    });

    return this.getMyProfile(pharmacyId);
  }
}
