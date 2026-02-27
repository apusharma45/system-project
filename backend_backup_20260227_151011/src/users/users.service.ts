import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  createUser(params: { email: string; passwordHash: string; role: Role }) {
    const { email, passwordHash, role } = params;

    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        patientProfile: role === Role.PATIENT ? { create: {} } : undefined,
        doctorProfile: role === Role.DOCTOR ? { create: {} } : undefined,
        pharmacyProfile: role === Role.PHARMACY ? { create: {} } : undefined,
        diagnosticProfile: role === Role.DIAGNOSTIC ? { create: {} } : undefined,
      },
    });
  }
}