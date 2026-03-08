import { Injectable } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly REGISTER_SELECT = {
    id: true,
    email: true,
    role: true,
  } as const;

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  createUser(params: {
    fullName: string;
    email: string;
    passwordHash: string;
    role: Role;
    phone: string;
    address: string;
    patientProfile?: {
      gender: string;
      dateOfBirth: Date;
      allergies?: string;
      chronicConditions?: string;
      currentMedications?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      emergencyContactRelation?: string;
    };
    professionalProfile?: {
      gender?: string;
      dateOfBirth?: Date;
      licenseNumber?: string;
      specialization?: string;
      pharmacyName?: string;
      labName?: string;
      degrees?: string[];
      certifications?: string[];
      yearsOfExperience?: number;
      licenseAuthority?: string;
      accreditations?: string[];
      availableTests?: string[];
    };
  }) {
    const {
      fullName,
      email,
      passwordHash,
      role,
      phone,
      address,
      patientProfile,
      professionalProfile,
    } = params;

    return this.prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role,
        phone,
        address,
        patientProfile: patientProfile ? { create: patientProfile } : undefined,
        professionalProfile: professionalProfile ? { create: professionalProfile } : undefined,
      },
      select: UsersService.REGISTER_SELECT,
    });
  }

  listByRole(role: Role) {
    return this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
