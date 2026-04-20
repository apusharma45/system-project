import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('register forwards dto to service', async () => {
    authServiceMock.register.mockResolvedValueOnce({ access_token: 'token' });
    const dto = {
      fullName: 'Patient One',
      email: 'a@a.com',
      password: 'secret123',
      phone: '+8801700000000',
      address: 'Dhaka',
      role: 'PATIENT' as const,
      patientProfile: { gender: 'MALE' as const, dateOfBirth: '1990-01-01' },
    };
    const result = await controller.register(dto);

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('login forwards dto to service', async () => {
    authServiceMock.login.mockResolvedValueOnce({ access_token: 'token' });
    const dto = { email: 'a@a.com', password: 'secret123' };
    const result = await controller.login(dto);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ access_token: 'token' });
  });

  it('forgotPassword forwards dto to service', async () => {
    authServiceMock.requestPasswordReset.mockResolvedValueOnce({
      message: 'If the email exists, a reset code has been sent.',
    });
    const dto = { email: 'a@a.com' };
    const result = await controller.forgotPassword(dto);

    expect(authServiceMock.requestPasswordReset).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      message: 'If the email exists, a reset code has been sent.',
    });
  });

  it('resetPassword forwards dto to service', async () => {
    authServiceMock.resetPassword.mockResolvedValueOnce({
      message: 'Password reset successful',
    });
    const dto = {
      email: 'a@a.com',
      resetCode: '123456',
      newPassword: 'secret123',
    };
    const result = await controller.resetPassword(dto);

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      message: 'Password reset successful',
    });
  });
});
