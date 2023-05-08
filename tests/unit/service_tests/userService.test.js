const { fakeInput } = require('../../fixtures/fakeNewUserData');
const { fakeConfirmedUser } = require('../../fixtures/fakeExistingUserData');
const User = require('../../../src/models/user');
const UserService = require('../../../src/services/userService');
const mongoose = require('mongoose');
const isEqual = require('lodash/isEqual');

const fakeDB = require('../../testUtils/fakeDB');

const { getTokens } = require('../../../src/utils/getTokens');
jest.mock('../../../src/utils/getTokens');

getTokens.mockReturnValue({
  confirmationCode: fakeConfirmedUser.confirmationCode,
  uuid: fakeConfirmedUser.uuid,
});

beforeAll(async () => fakeDB.connect());
afterAll(async () => fakeDB.disconnect());

beforeEach(async () => {
  await User.deleteMany({});
  await UserService.addUser(fakeInput.name, fakeInput.email);
});

describe('AddUser service', () => {
  it('Creates new User Object with valid input and saves valid Mongo Doc to DB', async () => {
    const result = await User.findOne({ name: fakeInput.name });

    expect(result).toBeDefined();
    expect(Object.keys(result._doc).length).toBe(7);
    expect(result.name).toBe(fakeConfirmedUser.name);
    expect(result.email).toBe(fakeConfirmedUser.email);
    expect(result.confirmationCode).toBe(fakeConfirmedUser.confirmationCode);
    expect(result.uuid).toBe(fakeConfirmedUser.uuid);
    expect(result._id).toBeDefined();
    expect(mongoose.isValidObjectId(result._id)).toBeTruthy();
  });

  it('Throws MongoError 11000 on duplicate entry', async () => {
    expect.assertions(2);
    try {
      await UserService.addUser(fakeInput.name, fakeInput.email);
    } catch (error) {
      const { name, code } = error;
      expect(name).toBe('MongoServerError');
      expect(code).toBe(11000);
    }
  });
});

describe('FindUserByCode service', () => {
  it('Returns User.findOne using confirmationCode', async () => {
    const expected = await User.findOne({ confirmationCode: fakeConfirmedUser.confirmationCode });
    const result = await UserService.findUserByCode(fakeConfirmedUser.confirmationCode);
    expect(isEqual(expected, result)).toBeTruthy();
  });

  it('Returns null if not called with confirmationCode', async () => {
    const expected = await User.findOne({ confirmationCode: fakeConfirmedUser.confirmationCode });
    const result = await UserService.findUserByCode(fakeConfirmedUser.name);
    expect(isEqual(expected, result)).toBeFalsy();
    expect(result).toBeNull();
  });
});

describe('FindUserById service', () => {
  it('Returns User.findOne using uuid', async () => {
    const expected = await User.findOne({ uuid: fakeConfirmedUser.uuid });
    const result = await UserService.findUserById(fakeConfirmedUser.uuid);
    expect(isEqual(expected, result)).toBeTruthy();
  });

  it('Returns null if not called with uuid', async () => {
    const expected = await User.findOne({ uuid: fakeConfirmedUser.uuid });
    const result = await UserService.findUserById(fakeConfirmedUser.confirmationCode);
    expect(isEqual(expected, result)).toBeFalsy();
    expect(result).toBeNull();
  });
});

describe('DeleteUser service', () => {
  it('Deletes the user from DB using uuid', async () => {
    const beforeDelete = await User.findOne({ uuid: fakeConfirmedUser.uuid });
    await UserService.deleteUser(fakeConfirmedUser.uuid);
    const afterDelete = await User.findOne({ uuid: fakeConfirmedUser.uuid });

    expect(isEqual(beforeDelete, afterDelete)).toBeFalsy();
    expect(afterDelete).toBeNull();
  });

  it(`Doesn't delete user if not called with uuid`, async () => {
    const beforeDelete = await User.findOne({ uuid: fakeConfirmedUser.uuid });
    await UserService.deleteUser(fakeConfirmedUser.name);
    const afterDelete = await User.findOne({ uuid: fakeConfirmedUser.uuid });

    expect(isEqual(beforeDelete, afterDelete)).toBeTruthy();
    expect(afterDelete).not.toBeNull();
  });
});

describe('ConfirmUser service', () => {
  it('Changes isValid status from false to true, updates in DB', async () => {
    const unconfirmedUser = await User.findOne({ uuid: fakeConfirmedUser.uuid });
    expect(unconfirmedUser.isValid).toBe(false);

    await UserService.confirmUser(unconfirmedUser);
    const confirmedUser = await User.findOne({ uuid: fakeConfirmedUser.uuid });
    expect(confirmedUser.isValid).toBe(true);
  });

  it('Trows TypeError if not called with User Model object', async () => {
    expect.assertions(2);
    try {
      await UserService.confirmUser(fakeConfirmedUser);
    } catch (error) {
      expect(error.name).toBe('TypeError');
      expect(error.message).toBe('user.save is not a function');
    }
  });
});
