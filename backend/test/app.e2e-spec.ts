import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'test-secret' });
  const authServiceMock = {
    register: jest.fn().mockResolvedValue({ access_token: 'register-token' }),
    login: jest.fn().mockResolvedValue({ access_token: 'login-token' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        $queryRawUnsafe: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Backend restarted successfully');
  });

  it('/health/db (GET)', async () => {
    await request(app.getHttpServer()).get('/health/db').expect(200).expect({
      status: 'ok',
    });
  });

  it('/auth/register (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'patient@example.com',
        password: 'secret123',
        role: 'PATIENT',
      })
      .expect(201)
      .expect({ access_token: 'register-token' });
  });

  it('/auth/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'patient@example.com',
        password: 'secret123',
      })
      .expect(201)
      .expect({ access_token: 'login-token' });
  });

  it('/auth/register (POST) rejects invalid role', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'patient@example.com',
        password: 'secret123',
        role: 'UNKNOWN',
      })
      .expect(400);
  });

  it('/auth/login (POST) rejects short password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'patient@example.com',
        password: '123',
      })
      .expect(400);
  });

  it('/users/me (GET) rejects unauthenticated request', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('/users/me (GET) allows doctor token', async () => {
    const token = await jwtService.signAsync({
      sub: 'doctor-1',
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        userId: 'doctor-1',
        email: 'doctor@example.com',
        role: 'DOCTOR',
      });
  });

  it('/users/me (GET) rejects patient role', async () => {
    const token = await jwtService.signAsync({
      sub: 'patient-1',
      email: 'patient@example.com',
      role: 'PATIENT',
    });

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
