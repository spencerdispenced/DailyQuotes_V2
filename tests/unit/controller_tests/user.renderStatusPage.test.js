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
    flash: jest.fn(),
  };
  res = {
    redirect: jest.fn(),
    render: jest.fn(),
  };
  next = jest.fn();
});

beforeEach(() => {
  jest.resetAllMocks();
  UserService.findUserById.mockReset();
});

describe('Render Status Page controller', () => {
  it('Throws error code 400 if user not found', async () => {
    UserService.findUserById.mockReturnValue();
    expect.assertions(2);
    await users.renderStatusPage(req, res, next).catch((err) => {
      expect(err.message).toBe('User not found');
      expect(err.statusCode).toBe(400);
    });
  });

  it('Renders correct status page for each status', async () => {
    const user = fakeConfirmedUser;
    UserService.findUserById.mockReturnValue(fakeConfirmedUser);
    const statuses = ['pending', 'confirmed', 'unsubscribe'];

    for (let state of statuses) {
      req.params.status = state;
      await users.renderStatusPage(req, res, next);
      expect(res.render).toHaveBeenCalledWith(`users/${state}`, { user });
    }
    expect(res.render).toHaveBeenCalledTimes(3);
  });

  it('Throws page not found error with invalid status', async () => {
    UserService.findUserById.mockReturnValue(fakeConfirmedUser);
    const statuses = ['pendle', 'confirm', 'unsubscribete'];

    expect.assertions(9);
    for (state of statuses) {
      req.params.status = state;
      await users.renderStatusPage(req, res, next).catch((err) => {
        expect(err.message).toBe('Page not found');
        expect(err.statusCode).toBe(404);
        expect(res.render).toHaveBeenCalledTimes(0);
      });
    }
  });
});
