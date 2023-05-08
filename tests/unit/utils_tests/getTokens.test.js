const { getTokens } = require('../../../src/utils/getTokens');
const { fakeInput } = require('../../fixtures/fakeNewUserData');
const { fakeConfirmedUser } = require('../../fixtures/fakeExistingUserData');

const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GetTokens Service', () => {
  it('Returns an object with JWT and uuid of length 42', () => {
    jwt.sign.mockReturnValue(fakeConfirmedUser.confirmationCode);
    const result = getTokens(fakeInput.email);
    expect(result.confirmationCode).toBe(fakeConfirmedUser.confirmationCode);
    expect(jwt.sign).toBeCalledTimes(1);
    expect(result.uuid.length).toBe(42);
  });

  it('Returns undefined with no email input', () => {
    jwt.sign.mockReturnValue();
    const result = getTokens();
    expect(result).toBeUndefined();
    expect(jwt.sign).toBeCalledTimes(1);
  });
});
