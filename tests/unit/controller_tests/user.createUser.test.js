const users = require('../../../src/controllers/users');
const { fakeInput } = require('../../fixtures/fakeNewUserData');
const { fakeConfirmedUser } = require('../../fixtures/fakeExistingUserData');
const FakeError = require('../../testUtils/FakeError');

// Mock services used in controller
const confirmEmail = require('../../../src/services/confirmEmail');
jest.mock('../../../src/services/confirmEmail');

const { getTokens } = require('../../../src/utils/getTokens');
jest.mock('../../../src/utils/getTokens');

const UserService = require('../../../src/services/userService');
jest.mock('../../../src/services/userService');

beforeAll(() => {
  getTokens.mockReturnValue({
    confirmationCode: fakeConfirmedUser.confirmationCode,
    uuid: fakeConfirmedUser.uuid,
  });
  req = {
    body: fakeInput,
    flash: jest.fn(),
  };
  res = { redirect: jest.fn() };
  next = jest.fn();
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Create user controller', () => {
  it('Calls addUser, confirmEmail, and then redirects to pending on valid input', async () => {
    const expected = fakeConfirmedUser;
    UserService.addUser.mockReturnValue(expected);

    const result = await users.createNewUser(req, res, next);

    expect(UserService.addUser).toHaveBeenCalledWith(result.name, result.email);
    expect(UserService.addUser).toHaveBeenCalledTimes(1);

    expect(confirmEmail).toHaveBeenCalledWith(result.name, result.email, result.confirmationCode);
    expect(confirmEmail).toHaveBeenCalledTimes(1);

    expect(res.redirect).toHaveBeenCalledWith(`/status/${result.uuid}/pending`);
    expect(res.redirect).toHaveBeenCalledTimes(1);
  });

  it(`Flashes 'error' and redirects to home on duplicate entry without calling confirmEmail`, async () => {
    UserService.addUser.mockImplementation(() => {
      throw new FakeError('Duplicate key error', 11000);
    });

    await users.createNewUser(req, res, next);
    expect(confirmEmail).toHaveBeenCalledTimes(0);

    expect(res.redirect).toHaveBeenCalledWith('/');
    expect(res.redirect).toHaveBeenCalledTimes(1);

    expect(req.flash).toHaveBeenCalledWith('error', 'Email already used!');
    expect(req.flash).toHaveBeenCalledTimes(1);
  });

  it('Calls next() if a different error', async () => {
    UserService.addUser.mockImplementation(() => {
      throw new FakeError('Different Error', 112233);
    });

    const result = await users.createNewUser(req, res, next);
    expect(next).toHaveBeenCalledWith(result);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
