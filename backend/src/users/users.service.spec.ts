import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('findByEmail forwards query to prisma', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
    const user = await service.findByEmail('a@b.com');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
    });
    expect(user).toEqual({ id: 'u1', email: 'a@b.com' });
  });

  it('createUser creates a user with role', async () => {
    prismaMock.user.create.mockResolvedValue({ id: 'u2', email: 'new@x.com' });

    const user = await service.createUser({
      fullName: 'New User',
      email: 'new@x.com',
      passwordHash: 'hash',
      role: Role.PATIENT,
      phone: '+8801700000000',
      address: 'Dhaka',
    });

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        fullName: 'New User',
        email: 'new@x.com',
        passwordHash: 'hash',
        role: Role.PATIENT,
        phone: '+8801700000000',
        address: 'Dhaka',
        patientProfile: undefined,
        professionalProfile: undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    expect(user).toEqual({ id: 'u2', email: 'new@x.com' });
  });
});
