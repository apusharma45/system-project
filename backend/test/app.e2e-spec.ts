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
  const DIAGNOSTIC_ID = '33333333-3333-4333-8333-333333333333';
  const PHARMACY_ID = '55555555-5555-4555-8555-555555555555';
  const ADMIN_ID = '66666666-6666-4666-8666-666666666666';
  const jwtService = new JwtService({ secret: process.env.JWT_SECRET || 'test-secret' });
  const authServiceMock = {
    register: jest.fn().mockResolvedValue({ access_token: 'register-token' }),
    login: jest.fn().mockResolvedValue({ access_token: 'login-token' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const appointments = new Map<string, any>();
    const labOrders = new Map<string, any>();
    const labResults = new Map<string, any>();
    const prescriptions = new Map<string, any>();
    const notifications = new Map<string, any>();
    const auditLogs = new Map<string, any>();
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
          if (where.id === DIAGNOSTIC_ID) {
            return Promise.resolve({ id: DIAGNOSTIC_ID, role: 'DIAGNOSTIC' });
          }
          if (where.id === PHARMACY_ID) {
            return Promise.resolve({ id: PHARMACY_ID, role: 'PHARMACY' });
          }
          if (where.id === ADMIN_ID) {
            return Promise.resolve({ id: ADMIN_ID, role: 'ADMIN' });
          }
          return Promise.resolve(null);
        }),
        findMany: jest.fn(({ where }: { where: { role: string } }) => {
          if (where.role === 'DOCTOR') {
            return Promise.resolve([{ id: DOCTOR_ID, email: 'doctor@example.com', role: 'DOCTOR' }]);
          }
          if (where.role === 'PHARMACY') {
            return Promise.resolve([
              { id: PHARMACY_ID, email: 'pharmacy@example.com', role: 'PHARMACY' },
            ]);
          }
          if (where.role === 'DIAGNOSTIC') {
            return Promise.resolve([
              { id: DIAGNOSTIC_ID, email: 'diagnostic@example.com', role: 'DIAGNOSTIC' },
            ]);
          }
          return Promise.resolve([]);
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
            requiresLab: false,
            labFlowLocked: false,
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
      labOrder: {
        findUnique: jest.fn(({ where, include }: any) => {
          const item =
            where.id !== undefined
              ? labOrders.get(where.id)
              : [...labOrders.values()].find((o) => o.appointmentId === where.appointmentId) ??
                null;
          if (!item) {
            return Promise.resolve(null);
          }
          if (!include) {
            return Promise.resolve(item);
          }
          const appointment = appointments.get(item.appointmentId);
          const labResult = [...labResults.values()].find((r) => r.labOrderId === item.id) ?? null;
          return Promise.resolve({ ...item, appointment, labResult });
        }),
        findMany: jest.fn(({ where }: any) => {
          const list = [...labOrders.values()].filter((order) => {
            const appointment = appointments.get(order.appointmentId);
            if (where?.diagnosticId) {
              return order.diagnosticId === where.diagnosticId;
            }
            if (where?.appointment?.doctorId) {
              return appointment?.doctorId === where.appointment.doctorId;
            }
            if (where?.appointment?.patientId) {
              return appointment?.patientId === where.appointment.patientId;
            }
            return true;
          });
          return Promise.resolve(
            list.map((order) => ({
              ...order,
              appointment: appointments.get(order.appointmentId),
              labResult:
                [...labResults.values()].find((r) => r.labOrderId === order.id) ?? null,
            })),
          );
        }),
        create: jest.fn(({ data }: any) => {
          const item = {
            id: randomUUID(),
            appointmentId: data.appointmentId,
            diagnosticId: data.diagnosticId,
            tests: data.tests ?? null,
            status: 'CREATED',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          labOrders.set(item.id, item);
          return Promise.resolve(item);
        }),
        update: jest.fn(({ where, data }: any) => {
          const existing = labOrders.get(where.id);
          const next = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };
          labOrders.set(where.id, next);
          return Promise.resolve(next);
        }),
      },
      labResult: {
        findUnique: jest.fn(({ where }: any) => {
          const item = [...labResults.values()].find((r) => r.labOrderId === where.labOrderId);
          return Promise.resolve(item ?? null);
        }),
        findFirst: jest.fn(({ where }: any) => {
          const appointmentId = where?.labOrder?.appointmentId;
          if (!appointmentId) {
            return Promise.resolve(null);
          }
          const order = [...labOrders.values()].find((o) => o.appointmentId === appointmentId);
          if (!order) {
            return Promise.resolve(null);
          }
          const result = [...labResults.values()].find((r) => r.labOrderId === order.id) ?? null;
          return Promise.resolve(result);
        }),
        create: jest.fn(({ data }: any) => {
          const item = {
            id: randomUUID(),
            labOrderId: data.labOrderId,
            fileUrl: data.fileUrl,
            uploadedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          labResults.set(item.id, item);
          return Promise.resolve(item);
        }),
      },
      prescription: {
        findUnique: jest.fn(({ where, include }: any) => {
          const item =
            where.id !== undefined
              ? prescriptions.get(where.id)
              : [...prescriptions.values()].find((p) => p.appointmentId === where.appointmentId) ??
                null;
          if (!item) {
            return Promise.resolve(null);
          }
          if (!include) {
            return Promise.resolve(item);
          }
          return Promise.resolve({
            ...item,
            appointment: appointments.get(item.appointmentId),
          });
        }),
        findMany: jest.fn(({ where }: any) => {
          const list = [...prescriptions.values()].filter((p) => {
            const appointment = appointments.get(p.appointmentId);
            if (where?.doctorId) {
              return p.doctorId === where.doctorId;
            }
            if (where?.pharmacyId) {
              return p.pharmacyId === where.pharmacyId;
            }
            if (where?.appointment?.patientId) {
              return appointment?.patientId === where.appointment.patientId;
            }
            return true;
          });
          return Promise.resolve(
            list.map((p) => ({
              ...p,
              appointment: appointments.get(p.appointmentId),
            })),
          );
        }),
        create: jest.fn(({ data }: any) => {
          const item = {
            id: randomUUID(),
            appointmentId: data.appointmentId,
            doctorId: data.doctorId,
            pharmacyId: data.pharmacyId,
            notes: data.notes,
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          prescriptions.set(item.id, item);
          return Promise.resolve(item);
        }),
        update: jest.fn(({ where, data }: any) => {
          const existing = prescriptions.get(where.id);
          const next = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };
          prescriptions.set(where.id, next);
          return Promise.resolve(next);
        }),
      },
      notification: {
        create: jest.fn(({ data }: any) => {
          const item = {
            id: randomUUID(),
            userId: data.userId,
            type: data.type,
            message: data.message,
            read: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          notifications.set(item.id, item);
          return Promise.resolve(item);
        }),
        findMany: jest.fn(({ where }: any) => {
          const list = [...notifications.values()]
            .filter((n) => n.userId === where.userId)
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
          return Promise.resolve(list);
        }),
        findUnique: jest.fn(({ where }: any) => {
          return Promise.resolve(notifications.get(where.id) ?? null);
        }),
        update: jest.fn(({ where, data }: any) => {
          const existing = notifications.get(where.id);
          const next = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };
          notifications.set(where.id, next);
          return Promise.resolve(next);
        }),
        updateMany: jest.fn(({ where, data }: any) => {
          let count = 0;
          for (const [id, item] of notifications.entries()) {
            if (item.userId !== where.userId) {
              continue;
            }
            if (where.read !== undefined && item.read !== where.read) {
              continue;
            }
            notifications.set(id, {
              ...item,
              ...data,
              updatedAt: new Date(),
            });
            count += 1;
          }
          return Promise.resolve({ count });
        }),
      },
      auditLog: {
        create: jest.fn(({ data }: any) => {
          const item = {
            id: randomUUID(),
            actorUserId: data.actorUserId ?? null,
            action: data.action,
            entityType: data.entityType,
            entityId: data.entityId,
            metadata: data.metadata ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          auditLogs.set(item.id, item);
          return Promise.resolve(item);
        }),
        findMany: jest.fn(({ where, take }: any) => {
          let list = [...auditLogs.values()];
          if (where?.actorUserId !== undefined) {
            list = list.filter((i) => i.actorUserId === where.actorUserId);
          }
          if (where?.entityType) {
            list = list.filter((i) => i.entityType === where.entityType);
          }
          if (where?.entityId) {
            list = list.filter((i) => i.entityId === where.entityId);
          }
          if (where?.createdAt?.gte) {
            list = list.filter((i) => i.createdAt >= where.createdAt.gte);
          }
          if (where?.createdAt?.lte) {
            list = list.filter((i) => i.createdAt <= where.createdAt.lte);
          }
          list = list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
          if (typeof take === 'number') {
            list = list.slice(0, take);
          }
          return Promise.resolve(list);
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
    const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    app.enableCors({
      origin: frontendOrigin.split(',').map((item) => item.trim()),
      credentials: true,
    });
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

  it('CORS allows configured frontend origin', async () => {
    await request(app.getHttpServer())
      .get('/health/db')
      .set('Origin', 'http://localhost:5173')
      .expect(200)
      .expect('access-control-allow-origin', 'http://localhost:5173')
      .expect('access-control-allow-credentials', 'true');
  });

  it('/auth/register (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Patient One',
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
        fullName: 'Patient One',
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

  it('/users/me (GET) allows patient token', async () => {
    const token = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        userId: PATIENT_ID,
        email: 'patient@example.com',
        role: 'PATIENT',
      });
  });

  it('/users/doctors (GET) allows patient role', async () => {
    const token = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
    });

    await request(app.getHttpServer())
      .get('/users/doctors')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([{ id: DOCTOR_ID, email: 'doctor@example.com', role: 'DOCTOR' }]);
  });

  it('/users/doctors (GET) rejects diagnostic role', async () => {
    const token = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });

    await request(app.getHttpServer())
      .get('/users/doctors')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('/users/pharmacies and /users/diagnostics (GET) allow doctor role', async () => {
    const token = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });

    await request(app.getHttpServer())
      .get('/users/pharmacies')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([{ id: PHARMACY_ID, email: 'pharmacy@example.com', role: 'PHARMACY' }]);

    await request(app.getHttpServer())
      .get('/users/diagnostics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([{ id: DIAGNOSTIC_ID, email: 'diagnostic@example.com', role: 'DIAGNOSTIC' }]);
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

  it('test-required workflow blocks close until lab result is uploaded', async () => {
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
    const diagnosticToken = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);

    const appointmentId = create.body.id;
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const order = await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/close`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/assign`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/sample-collected`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/result-uploaded`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .send({ fileUrl: 'https://files.test/result.pdf' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/close`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('CLOSED'));
  });

  it('labs endpoints enforce role guard and role-scoped list visibility', async () => {
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
    const diagnosticToken = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(403);

    const order = await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/labs/orders/me')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));
    await request(app.getHttpServer())
      .get('/labs/orders/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));
    await request(app.getHttpServer())
      .get('/labs/orders/me')
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));

    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/assign`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(403);
  });

  it('lab result endpoint enforces access controls', async () => {
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
    const diagnosticToken = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });
    const otherDoctorToken = await jwtService.signAsync({
      sub: '44444444-4444-4444-8444-444444444444',
      email: 'otherdoctor@example.com',
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
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const order = await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/assign`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/sample-collected`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/result-uploaded`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .send({ fileUrl: 'https://files.test/result.pdf' })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/labs/orders/${order.body.id}/result`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/labs/orders/${order.body.id}/result`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/labs/orders/${order.body.id}/result`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/labs/orders/${order.body.id}/result`)
      .set('Authorization', `Bearer ${otherDoctorToken}`)
      .expect(403);
  });

  it('prescription no-lab path reaches DISPENSED', async () => {
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
    const pharmacyToken = await jwtService.signAsync({
      sub: PHARMACY_ID,
      email: 'pharmacy@example.com',
      role: 'PHARMACY',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const prescription = await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        pharmacyId: PHARMACY_ID,
        notes: 'Take once daily',
      })
      .expect(201);
    expect(prescription.body.status).toBe('DRAFT');

    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/sign`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ notes: 'Take after meal' })
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('SIGNED'));
    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/send-patient`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('SENT_TO_PATIENT'));
    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/send-pharmacy`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('SENT_TO_PHARMACY'));
    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/dispense`)
      .set('Authorization', `Bearer ${pharmacyToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('DISPENSED'));
  });

  it('prescription signing is blocked until required lab result is uploaded', async () => {
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
    const diagnosticToken = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const order = await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(201);

    const prescription = await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        pharmacyId: PHARMACY_ID,
        notes: 'Take once daily',
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/sign`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/assign`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/sample-collected`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/result-uploaded`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .send({ fileUrl: 'https://files.test/result.pdf' })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/sign`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('SIGNED'));
  });

  it('prescription endpoints enforce role-scoped access', async () => {
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
    const pharmacyToken = await jwtService.signAsync({
      sub: PHARMACY_ID,
      email: 'pharmacy@example.com',
      role: 'PHARMACY',
    });
    const otherDoctorToken = await jwtService.signAsync({
      sub: '44444444-4444-4444-8444-444444444444',
      email: 'otherdoctor@example.com',
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
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        appointmentId,
        pharmacyId: PHARMACY_ID,
        notes: 'Take once daily',
      })
      .expect(403);

    const prescription = await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        pharmacyId: PHARMACY_ID,
        notes: 'Take once daily',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/prescriptions/me')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));
    await request(app.getHttpServer())
      .get('/prescriptions/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));
    await request(app.getHttpServer())
      .get('/prescriptions/me')
      .set('Authorization', `Bearer ${pharmacyToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));

    await request(app.getHttpServer())
      .get(`/prescriptions/${prescription.body.id}`)
      .set('Authorization', `Bearer ${otherDoctorToken}`)
      .expect(403);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/send-patient`)
      .set('Authorization', `Bearer ${pharmacyToken}`)
      .expect(403);
  });

  it('appointment call creates persistent patient notification', async () => {
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
      .patch(`/appointments/${create.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${create.body.id}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/notifications/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].type).toBe('APPOINTMENT_CALLED');
      });
  });

  it('lab result upload creates notifications for doctor and patient', async () => {
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
    const diagnosticToken = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const order = await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/assign`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/sample-collected`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/result-uploaded`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .send({ fileUrl: 'https://files.test/result.pdf' })
      .expect(200);

    await request(app.getHttpServer())
      .get('/notifications/me')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.some((n: any) => n.type === 'LAB_RESULT_UPLOADED')).toBe(true);
      });

    await request(app.getHttpServer())
      .get('/notifications/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.some((n: any) => n.type === 'LAB_RESULT_UPLOADED')).toBe(true);
      });
  });

  it('prescription send creates notifications for patient and pharmacy', async () => {
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
    const pharmacyToken = await jwtService.signAsync({
      sub: PHARMACY_ID,
      email: 'pharmacy@example.com',
      role: 'PHARMACY',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const prescription = await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        pharmacyId: PHARMACY_ID,
        notes: 'Take once daily',
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/sign`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/send-patient`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${prescription.body.id}/send-pharmacy`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/notifications/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.some((n: any) => n.type === 'PRESCRIPTION_READY')).toBe(true);
      });
    await request(app.getHttpServer())
      .get('/notifications/me')
      .set('Authorization', `Bearer ${pharmacyToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.some((n: any) => n.type === 'PRESCRIPTION_READY')).toBe(true);
      });
  });

  it('notification read endpoints enforce ownership and update read state', async () => {
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
      .patch(`/appointments/${create.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${create.body.id}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const list = await request(app.getHttpServer())
      .get('/notifications/me')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200);
    const notificationId = list.body[0].id;

    await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ read: true })
      .expect(200)
      .expect((res) => expect(res.body.read).toBe(true));

    await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({ read: true })
      .expect(403);

    await request(app.getHttpServer())
      .patch('/notifications/read-all')
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200)
      .expect((res) => expect(res.body).toHaveProperty('count'));
  });

  it('audit logs are created across appointment, lab, and prescription workflow', async () => {
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
    const diagnosticToken = await jwtService.signAsync({
      sub: DIAGNOSTIC_ID,
      email: 'diagnostic@example.com',
      role: 'DIAGNOSTIC',
    });
    const pharmacyToken = await jwtService.signAsync({
      sub: PHARMACY_ID,
      email: 'pharmacy@example.com',
      role: 'PHARMACY',
    });
    const adminToken = await jwtService.signAsync({
      sub: ADMIN_ID,
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    const create = await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        doctorId: DOCTOR_ID,
        scheduledAt: new Date().toISOString(),
      })
      .expect(201);
    const appointmentId = create.body.id;

    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/call`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/in-visit`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/appointments/${appointmentId}/exam-done`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    const order = await request(app.getHttpServer())
      .post('/labs/orders')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        diagnosticId: DIAGNOSTIC_ID,
        tests: [{ title: 'Test 1', description: 'CBC panel' }],
      })
      .expect(201);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/assign`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/sample-collected`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/labs/orders/${order.body.id}/result-uploaded`)
      .set('Authorization', `Bearer ${diagnosticToken}`)
      .send({ fileUrl: 'https://files.test/result.pdf' })
      .expect(200);

    const rx = await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        appointmentId,
        pharmacyId: PHARMACY_ID,
        notes: 'Take once daily',
      })
      .expect(201);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${rx.body.id}/sign`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${rx.body.id}/send-patient`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${rx.body.id}/send-pharmacy`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch(`/prescriptions/${rx.body.id}/dispense`)
      .set('Authorization', `Bearer ${pharmacyToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/audit')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.some((a: any) => a.action === 'APPOINTMENT_CALLED')).toBe(true);
        expect(res.body.some((a: any) => a.action === 'LAB_RESULT_UPLOADED')).toBe(true);
        expect(res.body.some((a: any) => a.action === 'PRESCRIPTION_DISPENSED')).toBe(true);
      });
  });

  it('/audit/me returns actor-scoped logs', async () => {
    const doctorToken = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });
    const patientToken = await jwtService.signAsync({
      sub: PATIENT_ID,
      email: 'patient@example.com',
      role: 'PATIENT',
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
      .patch(`/appointments/${create.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/audit/me')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.every((a: any) => a.actorUserId === DOCTOR_ID)).toBe(true);
      });
  });

  it('/audit rejects non-admin and allows admin', async () => {
    const doctorToken = await jwtService.signAsync({
      sub: DOCTOR_ID,
      email: 'doctor@example.com',
      role: 'DOCTOR',
    });
    const adminToken = await jwtService.signAsync({
      sub: ADMIN_ID,
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    await request(app.getHttpServer())
      .get('/audit')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(403);
    await request(app.getHttpServer())
      .get('/audit')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('/audit/entity filters logs by entity', async () => {
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
    const adminToken = await jwtService.signAsync({
      sub: ADMIN_ID,
      email: 'admin@example.com',
      role: 'ADMIN',
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
      .patch(`/appointments/${create.body.id}/confirm`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/audit/entity/Appointment/${create.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(0);
        expect(
          res.body.every((a: any) => a.entityType === 'Appointment' && a.entityId === create.body.id),
        ).toBe(true);
      });
  });
});
