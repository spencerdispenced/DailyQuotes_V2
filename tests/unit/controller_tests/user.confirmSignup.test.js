const users = require('../../../src/controllers/users');
const { fakeConfirmedUser, fakeUnconfirmedUser } = require('../../fixtures/fakeExistingUserData');

// Mock services used in controller
const UserService = require('../../../src/services/userService');
jest.mock('../../../src/services/userService');

beforeAll(() => {
  req = {
    params: {
      confirmationCode: fakeConfirmedUser.confirmationCode,
    },
    flash: jest.fn(),
  };
  res = { redirect: jest.fn() };
  next = jest.fn();
});

beforeEach(() => {
  jest.resetAllMocks();
  UserService.findUserByCode.mockReset();
});

describe('Confirm Signup controller', () => {
  it('Throws error code 400 if user not found', async () => {
    expect.assertions(2);
    await users.confirmSignup(req, res, next).catch((err) => {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(400);
    });
  });

  it('Flashes a success and redirects to confirmed page if already confirmed', async () => {
    UserService.findUserByCode.mockReturnValueOnce(fakeConfirmedUser);

    const result = await users.confirmSignup(req, res, next);

    expect(req.flash).toHaveBeenCalledWith('success', 'You already confirmed!');
    expect(req.flash).toHaveBeenCalledTimes(1);

    expect(UserService.confirmUser).toHaveBeenCalledTimes(0);

    expect(res.redirect).toHaveBeenCalledWith(`/status/${result.uuid}/confirmed`);
    expect(res.redirect).toHaveBeenCalledTimes(1);
  });

  it('Calls confirmUser service and redirects to confirmed page on valid input', async () => {
    UserService.findUserByCode.mockReturnValue(fakeUnconfirmedUser);
    const result = await users.confirmSignup(req, res, next);

    expect(UserService.findUserByCode).toHaveBeenCalledWith(fakeUnconfirmedUser.confirmationCode);
    expect(UserService.findUserByCode).toHaveBeenCalledTimes(1);

    expect(UserService.confirmUser).toHaveBeenCalledWith(result);
    expect(UserService.confirmUser).toHaveBeenCalledTimes(1);

    expect(req.flash).toHaveBeenCalledTimes(0);

    expect(res.redirect).toHaveBeenCalledWith(`/status/${result.uuid}/confirmed`);
    expect(res.redirect).toHaveBeenCalledTimes(1);
  });
});
