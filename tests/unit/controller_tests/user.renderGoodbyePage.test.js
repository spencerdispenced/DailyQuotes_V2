const users = require('../../../src/controllers/users');

beforeAll(() => {
  req = jest.fn();
  res = { render: jest.fn() };
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Render Goodbye controller', () => {
  it('Calls render with proper URL', () => {
    users.renderUnsubcribedPage(req, res);
    expect(res.render).toBeCalledWith('users/goodbye');
    expect(res.render).toBeCalledTimes(1);
  });
});
