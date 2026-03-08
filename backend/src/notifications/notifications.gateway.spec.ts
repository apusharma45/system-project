import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsGateway', () => {
  const jwtServiceMock = {
    verifyAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds user room name', () => {
    const gateway = new NotificationsGateway(jwtServiceMock as any);
    expect(gateway.roomForUser('u1')).toBe('user:u1');
  });

  it('joins user room on valid token from handshake auth', async () => {
    const gateway = new NotificationsGateway(jwtServiceMock as any);
    const join = jest.fn();
    const disconnect = jest.fn();
    jwtServiceMock.verifyAsync.mockResolvedValueOnce({
      sub: 'u1',
      email: 'u@x.com',
      role: 'PATIENT',
    });

    const client: any = {
      handshake: {
        auth: { token: 'abc.def.ghi' },
        headers: {},
      },
      data: {},
      join,
      disconnect,
    };

    await gateway.handleConnection(client);
    expect(join).toHaveBeenCalledWith('user:u1');
    expect(disconnect).not.toHaveBeenCalled();
    expect(client.data.user.userId).toBe('u1');
  });

  it('disconnects socket when token is missing or invalid', async () => {
    const gateway = new NotificationsGateway(jwtServiceMock as any);
    const disconnectOne = jest.fn();
    const disconnectTwo = jest.fn();
    jwtServiceMock.verifyAsync.mockRejectedValueOnce(new Error('bad token'));

    const missingTokenClient: any = {
      handshake: {
        auth: {},
        headers: {},
      },
      data: {},
      join: jest.fn(),
      disconnect: disconnectOne,
    };
    const invalidTokenClient: any = {
      handshake: {
        auth: { token: 'bad.token' },
        headers: {},
      },
      data: {},
      join: jest.fn(),
      disconnect: disconnectTwo,
    };

    await gateway.handleConnection(missingTokenClient);
    await gateway.handleConnection(invalidTokenClient);

    expect(disconnectOne).toHaveBeenCalled();
    expect(disconnectTwo).toHaveBeenCalled();
  });
});
