import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock; createUser: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(null),
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('throws UnauthorizedException when user does not exist', async () => {
    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws ConflictException when registering duplicate email', async () => {
    usersService.findByEmail.mockResolvedValueOnce({ id: 'u1', email: 'used@example.com' });

    await expect(
      service.register({
        fullName: 'Used Account',
        email: 'used@example.com',
        password: 'secret123',
        phone: '+8801700000000',
        address: 'Dhaka',
        role: 'PATIENT',
        patientProfile: {
          gender: 'MALE',
          dateOfBirth: '1990-01-01',
        },
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates PATIENT user with patient profile data', async () => {
    usersService.createUser.mockResolvedValueOnce({
      id: 'u3',
      email: 'patient@example.com',
      role: 'PATIENT',
    });

    await service.register({
      fullName: 'Patient One',
      email: 'patient@example.com',
      password: 'secret123',
      phone: '+8801700000000',
      address: 'Dhaka',
      role: 'PATIENT',
      patientProfile: {
        gender: 'FEMALE',
        dateOfBirth: '1998-07-11',
      },
    });

    expect(usersService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'PATIENT',
        phone: '+8801700000000',
        address: 'Dhaka',
        patientProfile: expect.objectContaining({
          gender: 'FEMALE',
        }),
      }),
    );
  });

  it('throws BadRequestException when doctor required fields are missing', async () => {
    await expect(
      service.register({
        fullName: 'Doctor One',
        email: 'doctor@example.com',
        password: 'secret123',
        phone: '+8801700000000',
        address: 'Dhaka',
        role: 'DOCTOR',
        professionalProfile: {
          licenseNumber: 'DOC-123',
        },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws UnauthorizedException when password is invalid', async () => {
    const validHash = await bcrypt.hash('correctpass', 10);
    usersService.findByEmail.mockResolvedValueOnce({
      id: 'u2',
      email: 'exists@example.com',
      passwordHash: validHash,
      role: 'PATIENT',
    });

    await expect(
      service.login({
        email: 'exists@example.com',
        password: 'wrongpass',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
