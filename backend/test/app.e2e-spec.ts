import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const DOCTOR_ID = '11111111-1111-4111-8111-111111111111';
  const PATIENT_ID = '22222222-2222-4222-8222-222222222222';
  const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'test-secret' });
  const authServiceMock = {
    register: jest.fn().mockResolvedValue({ access_token: 'register-token' }),
    login: jest.fn().mockResolvedValue({ access_token: 'login-token' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const appointments = new Map<string, any>();
    const prismaMock = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $queryRawUnsafe: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      user: {
        findUnique: jest.fn(({ where }: { where: { id: string } }) => {
          if (where.id === DOCTOR_ID) {
            return Promise.resolve({ id: DOCTOR_ID, role: 'DOCTOR' });
          }
          if (where.id === PATIENT_ID) {
            return Promise.resolve({ id: PATIENT_ID, role: 'PATIENT' });
          }
          return Promise.resolve(null);
        }),
      },
      appointment: {
        create: jest.fn(({ data }: any) => {
          const item = {
            id: randomUUID(),
            patientId: data.patientId,
            doctorId: data.doctorId,
            status: 'REQUESTED',
            scheduledAt: data.scheduledAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          appointments.set(item.id, item);
          return Promise.resolve(item);
        }),
        findMany: jest.fn(({ where }: any) => {
          const list = [...appointments.values()].filter((a) => {
            if (where.patientId) return a.patientId === where.patientId;
            if (where.doctorId) return a.doctorId === where.doctorId;
            return true;
          });
          return Promise.resolve(list);
        }),
        findUnique: jest.fn(({ where }: any) => {
          return Promise.resolve(appointments.get(where.id) ?? null);
        }),
        update: jest.fn(({ where, data }: any) => {
          const existing = appointments.get(where.id);
          const next = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };
          appointments.set(where.id, next);
          return Promise.resolve(next);
        }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
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
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        userId: DOCTOR_ID,
        email: 'doctor@example.com',
        role: 'DOCTOR',
      });
  });

  it('/users/me (GET) rejects patient role', async () => {
    const token = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('appointment flow reaches CLOSED through valid transitions', async () => {
    const patientToken = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });
    const doctorToken = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    expect(create.body.status).toBe('REQUESTED');

    const id = create.body.id;
    await request(app.getHttpServer())
      .patch(`/appointments/${id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('CONFIRMED'));

    await request(app.getHttpServer())
      .patch(`/appointments/${id}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('CALLED'));

    await request(app.getHttpServer())
      .patch(`/appointments/${id}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('IN_VISIT'));

    await request(app.getHttpServer())
      .patch(`/appointments/${id}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('EXAM_DONE'));

    await request(app.getHttpServer())
      .patch(`/appointments/${id}/close`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('CLOSED'));

    await request(app.getHttpServer())
      .get('/appointments/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));
  });

  it('rejects invalid transition REQUESTED -> EXAM_DONE', async () => {
    const patientToken = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });
    const doctorToken = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/appointments/${create.body.id}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(400);
  });

  it('rejects patient calling doctor-only endpoint', async () => {
    const patientToken = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });

    await request(app.getHttpServer())
      .patch(`/appointments/${randomUUID()}/call`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(403);
  });

  it('patient cancel REQUESTED succeeds and IN_VISIT fails', async () => {
    const patientToken = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });
    const doctorToken = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    const one = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/appointments/${one.body.id}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('CANCELLED'));

    const two = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(400);
  });

  it('doctor cancel IN_VISIT succeeds and EXAM_DONE fails', async () => {
    const patientToken = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });
    const doctorToken = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    const one = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/appointments/${one.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${one.body.id}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${one.body.id}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${one.body.id}/cancel`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('CANCELLED'));

    const two = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/appointments/${two.body.id}/cancel`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(400);
  });
});
