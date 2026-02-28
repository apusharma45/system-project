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

  createUser(params: { email: string; passwordHash: string; role: Role }) {
    const { email, passwordHash, role } = params;
    return this.prisma.user.create({
      data: { email, passwordHash, role },
    });
  }

  listByRole(role: Role) {
    return this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
