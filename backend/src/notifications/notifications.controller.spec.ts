import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  const serviceMock = {
    listMine: jest.fn(),
    markRead: jest.fn(),
    markAllRead: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('listMine forwards user id', async () => {
    serviceMock.listMine.mockResolvedValueOnce([]);
    const result = await controller.listMine({ user: { userId: 'u1' } });
    expect(serviceMock.listMine).toHaveBeenCalledWith('u1');
    expect(result).toEqual([]);
  });

  it('markAllRead forwards user id', async () => {
    serviceMock.markAllRead.mockResolvedValueOnce({ count: 2 });
    const result = await controller.markAllRead({ user: { userId: 'u1' } });
    expect(serviceMock.markAllRead).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ count: 2 });
  });

  it('markRead forwards user id, notification id, and read flag', async () => {
    serviceMock.markRead.mockResolvedValueOnce({ id: 'n1', read: true });
    const result = await controller.markRead({ user: { userId: 'u1' } }, 'n1', { read: true });
    expect(serviceMock.markRead).toHaveBeenCalledWith('u1', 'n1', true);
    expect(result).toEqual({ id: 'n1', read: true });
  });
});
