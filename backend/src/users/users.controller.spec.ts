import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(() => {
    controller = new UsersController();
  });

  it('me returns request user payload', () => {
    const req = { user: { userId: 'u1', email: 'd@x.com', role: 'DOCTOR' } };
    expect(controller.me(req)).toEqual(req.user);
  });
});
