import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDiagnosticMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class DiagnosticService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDiagnosticProfile(diagnosticId: string) {
    const diagnostic = await this.prisma.user.findUnique({
      where: { id: diagnosticId },
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

    if (!diagnostic || diagnostic.role !== Role.DIAGNOSTIC) {
      throw new NotFoundException('Diagnostic user not found');
    }

    return {
      diagnostic: {
        id: diagnostic.id,
        fullName: diagnostic.fullName,
        avatarUrl: diagnostic.avatarUrl,
        email: diagnostic.email,
        role: diagnostic.role,
        phone: diagnostic.phone,
        address: diagnostic.address,
        joinedAt: diagnostic.createdAt,
        profile: diagnostic.professionalProfile,
      },
    };
  }

  async getMyProfile(diagnosticId: string) {
    return this.getDiagnosticProfile(diagnosticId);
  }

  async getProfileForAdmin(diagnosticId: string) {
    return this.getDiagnosticProfile(diagnosticId);
  }

  private async updateDiagnosticProfile(
    diagnosticId: string,
    dto: UpdateDiagnosticMyProfileDto,
  ) {
    const diagnostic = await this.prisma.user.findUnique({
      where: { id: diagnosticId },
      select: { id: true, role: true },
    });

    if (!diagnostic || diagnostic.role !== Role.DIAGNOSTIC) {
      throw new NotFoundException('Diagnostic user not found');
    }

    const profileData = {
      ...(dto.licenseNumber !== undefined ? { licenseNumber: dto.licenseNumber } : {}),
      ...(dto.specialization !== undefined ? { specialization: dto.specialization } : {}),
      ...(dto.dateOfBirth !== undefined
        ? { dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null }
        : {}),
      ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
    };
    const hasProfileData = Object.keys(profileData).length > 0;

    await this.prisma.user.update({
      where: { id: diagnosticId },
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

    return this.getDiagnosticProfile(diagnosticId);
  }

  async updateMyProfile(diagnosticId: string, dto: UpdateDiagnosticMyProfileDto) {
    return this.updateDiagnosticProfile(diagnosticId, dto);
  }

  async updateProfileForAdmin(diagnosticId: string, dto: UpdateDiagnosticMyProfileDto) {
    return this.updateDiagnosticProfile(diagnosticId, dto);
  }
}
