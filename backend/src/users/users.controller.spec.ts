import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    uploadMyAvatar: jest.fn(),
    removeMyAvatar: jest.fn(),
    listByRole: jest.fn(),
  };

  beforeEach(() => {
    controller = new UsersController(usersServiceMock as any);
  });

  it('me returns request user payload', () => {
    const req = { user: { userId: 'u1', email: 'd@x.com', role: 'DOCTOR' } };
    expect(controller.me(req)).toEqual(req.user);
  });
});
