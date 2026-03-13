import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../generated/prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
  const cloudinaryMock = {
    uploadBuffer: jest.fn(),
    destroy: jest.fn(),
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
        {
          provide: CloudinaryService,
          useValue: cloudinaryMock,
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
        avatarUrl: true,
      },
    });
    expect(user).toEqual({ id: 'u2', email: 'new@x.com' });
  });

  it('listDoctorsForPatients returns enriched doctor summary fields', async () => {
    prismaMock.user.findMany.mockResolvedValueOnce([
      {
        id: 'd1',
        fullName: 'Dr. Alice',
        avatarUrl: 'https://example.com/avatar.png',
        email: 'alice@example.com',
        role: Role.DOCTOR,
        professionalProfile: {
          specialization: 'Cardiology',
          yearsOfExperience: 8,
        },
      },
    ]);

    const result = await service.listDoctorsForPatients();

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: { role: Role.DOCTOR },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        email: true,
        role: true,
        professionalProfile: {
          select: {
            specialization: true,
            yearsOfExperience: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result[0]).toMatchObject({
      id: 'd1',
      specialization: 'Cardiology',
      yearsOfExperience: 8,
    });
  });

  it('getDoctorDetailsForPatients returns patient-facing details payload', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'd1',
      fullName: 'Dr. Alice',
      avatarUrl: 'https://example.com/avatar.png',
      email: 'alice@example.com',
      role: Role.DOCTOR,
      phone: '+8801700000001',
      address: 'Dhaka',
      professionalProfile: {
        specialization: 'Cardiology',
        yearsOfExperience: 8,
        degrees: ['MBBS'],
        about: 'Senior consultant',
        clinicName: 'Heart Care',
        clinicAddress: 'Dhaka',
        clinicPhone: '+8801711111111',
        availableTimeSlots: [{ day: 'MONDAY', startTime: '09:00', endTime: '12:00' }],
      },
    });

    const result = await service.getDoctorDetailsForPatients('d1');

    expect(result.doctor.id).toBe('d1');
    expect(result.doctor.clinicName).toBe('Heart Care');
    expect(result.doctor.availableTimeSlots).toEqual([
      { day: 'MONDAY', startTime: '09:00', endTime: '12:00' },
    ]);
  });
});
