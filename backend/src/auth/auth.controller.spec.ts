import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
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
    const dto = { email: 'a@a.com', password: 'secret123', role: 'PATIENT' as const };
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
});
