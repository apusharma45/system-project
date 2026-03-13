import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    uploadMyAvatar: jest.fn(),
    removeMyAvatar: jest.fn(),
    listByRole: jest.fn(),
    listDoctorsForPatients: jest.fn(),
    getDoctorDetailsForPatients: jest.fn(),
  };

  beforeEach(() => {
    controller = new UsersController(usersServiceMock as any);
  });

  it('me returns request user payload', () => {
    const req = { user: { userId: 'u1', email: 'd@x.com', role: 'DOCTOR' } };
    expect(controller.me(req)).toEqual(req.user);
  });

  it('listDoctors delegates to patient-safe doctors list', () => {
    controller.listDoctors();
    expect(usersServiceMock.listDoctorsForPatients).toHaveBeenCalled();
  });

  it('getDoctorDetails delegates to users service', () => {
    controller.getDoctorDetails('11111111-1111-1111-1111-111111111111');
    expect(usersServiceMock.getDoctorDetailsForPatients).toHaveBeenCalledWith(
      '11111111-1111-1111-1111-111111111111',
    );
  });
});
