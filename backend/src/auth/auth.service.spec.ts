import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEmailService } from './auth-email.service';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock; createUser: jest.Mock };
  let prismaService: {
    passwordResetCode: {
      create: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      deleteMany: jest.Mock;
    };
    user: {
      updateMany: jest.Mock;
    };
  };
  let authEmailService: { sendPasswordResetCode: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(null),
      createUser: jest.fn(),
    };
    prismaService = {
      passwordResetCode: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
      user: {
        updateMany: jest.fn(),
      },
    };
    authEmailService = {
      sendPasswordResetCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: AuthEmailService,
          useValue: authEmailService,
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

  it('requestPasswordReset returns generic success for unknown email', async () => {
    usersService.findByEmail.mockResolvedValueOnce(null);

    const result = await service.requestPasswordReset({
      email: 'unknown@example.com',
    });

    expect(result).toEqual({
      message: 'If the email exists, a reset code has been sent.',
    });
    expect(prismaService.passwordResetCode.create).not.toHaveBeenCalled();
    expect(authEmailService.sendPasswordResetCode).not.toHaveBeenCalled();
  });

  it('requestPasswordReset stores code and sends email for existing user', async () => {
    usersService.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      email: 'known@example.com',
      fullName: 'Known User',
    });

    const result = await service.requestPasswordReset({
      email: 'known@example.com',
    });

    expect(result).toEqual({
      message: 'If the email exists, a reset code has been sent.',
    });
    expect(prismaService.passwordResetCode.create).toHaveBeenCalled();
    expect(authEmailService.sendPasswordResetCode).toHaveBeenCalledWith(
      expect.objectContaining({
        toEmail: 'known@example.com',
        fullName: 'Known User',
      }),
    );
  });

  it('resetPassword rejects invalid code', async () => {
    const wrongCodeHash = await bcrypt.hash('999999', 10);
    prismaService.passwordResetCode.findFirst.mockResolvedValueOnce({
      id: 'r1',
      codeHash: wrongCodeHash,
      attemptCount: 0,
    });

    await expect(
      service.resetPassword({
        email: 'patient@example.com',
        resetCode: '123456',
        newPassword: 'newpass123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(prismaService.passwordResetCode.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { attemptCount: { increment: 1 } },
    });
  });

  it('resetPassword updates password and consumes code when valid', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    prismaService.passwordResetCode.findFirst.mockResolvedValueOnce({
      id: 'r1',
      codeHash,
      attemptCount: 0,
    });
    prismaService.user.updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await service.resetPassword({
      email: 'patient@example.com',
      resetCode: '123456',
      newPassword: 'newpass123',
    });

    expect(result).toEqual({ message: 'Password reset successful' });
    expect(prismaService.user.updateMany).toHaveBeenCalledWith({
      where: { email: 'patient@example.com' },
      data: { passwordHash: expect.any(String) },
    });
    expect(prismaService.passwordResetCode.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { consumedAt: expect.any(Date) },
    });
    expect(prismaService.passwordResetCode.deleteMany).toHaveBeenCalledWith({
      where: {
        email: 'patient@example.com',
        consumedAt: null,
      },
    });
  });
});
