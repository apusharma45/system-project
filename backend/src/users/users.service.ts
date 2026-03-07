import { Injectable } from '@nestjs/common';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  createUser(params: { fullName: string; email: string; passwordHash: string; role: Role }) {
    const { fullName, email, passwordHash, role } = params;
    return this.prisma.user.create({
      data: { fullName, email, passwordHash, role },
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
