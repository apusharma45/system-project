import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDiagnosticMyProfileDto } from './dto/update-my-profile.dto';

@Injectable()
export class DiagnosticService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(diagnosticId: string) {
    const diagnostic = await this.prisma.user.findUnique({
      where: { id: diagnosticId },
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

    if (!diagnostic || diagnostic.role !== Role.DIAGNOSTIC) {
      throw new NotFoundException('Diagnostic user not found');
    }

    return {
      diagnostic: {
        id: diagnostic.id,
        fullName: diagnostic.fullName,
        email: diagnostic.email,
        role: diagnostic.role,
        phone: diagnostic.phone,
        address: diagnostic.address,
        joinedAt: diagnostic.createdAt,
        profile: diagnostic.professionalProfile,
      },
    };
  }

  async updateMyProfile(diagnosticId: string, dto: UpdateDiagnosticMyProfileDto) {
    const diagnostic = await this.prisma.user.findUnique({
      where: { id: diagnosticId },
      select: { id: true, role: true },
    });

    if (!diagnostic || diagnostic.role !== Role.DIAGNOSTIC) {
      throw new NotFoundException('Diagnostic user not found');
    }

    await this.prisma.user.update({
      where: { id: diagnosticId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
      },
    });

    return this.getMyProfile(diagnosticId);
  }
}
