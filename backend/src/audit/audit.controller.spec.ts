import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('AuditController', () => {
  let controller: AuditController;
  const serviceMock = {
    listForAdmin: jest.fn(),
    listMine: jest.fn(),
    listByEntity: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [{ provide: AuditService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AuditController>(AuditController);
  });

  it('forwards listForAdmin query', async () => {
    serviceMock.listForAdmin.mockResolvedValueOnce([]);
    const query = { limit: 10 };
    const result = await controller.listForAdmin(query);
    expect(serviceMock.listForAdmin).toHaveBeenCalledWith(query);
    expect(result).toEqual([]);
  });

  it('forwards listMine user and query', async () => {
    serviceMock.listMine.mockResolvedValueOnce([]);
    const query = { entityType: 'Appointment' };
    const result = await controller.listMine({ user: { userId: 'u1' } }, query);
    expect(serviceMock.listMine).toHaveBeenCalledWith('u1', query);
    expect(result).toEqual([]);
  });

  it('forwards listByEntity params', async () => {
    serviceMock.listByEntity.mockResolvedValueOnce([]);
    const query = { limit: 5 };
    const result = await controller.listByEntity('Appointment', 'a1', query);
    expect(serviceMock.listByEntity).toHaveBeenCalledWith('Appointment', 'a1', query);
    expect(result).toEqual([]);
  });
});
