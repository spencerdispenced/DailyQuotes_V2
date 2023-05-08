const users = require('../../../src/controllers/users');
const { fakeConfirmedUser } = require('../../fixtures/fakeExistingUserData');

// Mock services used in controller
const UserService = require('../../../src/services/userService');
jest.mock('../../../src/services/userService');

beforeAll(() => {
  req = {
    params: {
      uuid: fakeConfirmedUser.uuid,
    },
  };
  res = {
    redirect: jest.fn(),
  };
  next = jest.fn();
});

beforeEach(() => {
  jest.resetAllMocks();
  UserService.findUserById.mockReset();
});

describe('Delete user controller', () => {
  it('Throws error code 400 if user not found', async () => {
    expect.assertions(3);
    await users.deleteUser(req, res, next).catch((err) => {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(400);
      expect(res.redirect).toBeCalledTimes(0);
    });
  });

  it('Calls delete user and redirects to unsubbed', async () => {
    UserService.findUserById.mockReturnValue(fakeConfirmedUser);

    await users.deleteUser(req, res, next);

    expect(UserService.deleteUser).toBeCalledWith(req.params.uuid);
    expect(UserService.deleteUser).toBeCalledTimes(1);

    expect(res.redirect).toBeCalledWith(`/goodbye`);
    expect(res.redirect).toBeCalledTimes(1);
  });
});
