import { ConflictException, UnauthorizedException } from '@nestjs/common';
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
        role: 'PATIENT',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
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
