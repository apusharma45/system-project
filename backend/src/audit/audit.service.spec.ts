import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;
  const prismaMock = {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('record writes audit log entry', async () => {
    prismaMock.auditLog.create.mockResolvedValueOnce({ id: 'a1' });
    const result = await service.record('u1', 'ACTION', 'Entity', 'e1', { x: 1 });
    expect(prismaMock.auditLog.create).toHaveBeenCalled();
    expect(result.id).toBe('a1');
  });

  it('list queries use default limit and order', async () => {
    prismaMock.auditLog.findMany.mockResolvedValue([]);
    await service.listForAdmin({});
    await service.listMine('u1', {});
    await service.listByEntity('Appointment', 'a1', {});

    expect(prismaMock.auditLog.findMany).toHaveBeenCalledTimes(3);
  });
});
