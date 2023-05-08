require('dotenv').config({ path: `./configs/.env.development` });

const request = require('supertest');
const app = require('../../../src/app');
const fakeDB = require('../../testUtils/fakeDB');
const { fakeInput } = require('../../fixtures/fakeNewUserData');
const { fakeConfirmedUser, fakeUnconfirmedUser } = require('../../fixtures/fakeExistingUserData');
const User = require('../../../src/models/user');

const confirmEmail = require('../../../src/services/confirmEmail');
jest.mock('../../../src/services/confirmEmail');

beforeAll(async () => await fakeDB.connect());
afterAll(async () => await fakeDB.disconnect());

beforeEach(async () => {
  jest.resetAllMocks();
  await User.deleteMany({});
});

describe('GET / (Home Page)', () => {
  it('Returns HTML page with StatusCode 200', async () => {
    const res = await request(app).get('/');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch('Sign up for Daily Quotes!');
  });
});

describe('POST /register', () => {
  it('User created and stored in DB, then redirects(302) on valid input', async () => {
    // Confirm Email is mocked just to make less clutter while testing routes
    // Will be fully tested in a separate file
    const regexPattern = /Found. Redirecting to \/status\/\S{42}\/pending/;
    const res = await request(app).post('/register').send(fakeInput);

    const user = await User.findOne({ name: fakeInput.name });
    expect(user.name).toBe(fakeInput.name);
    expect(user.email).toBe(fakeInput.email);
    expect(res.text).toMatch(regexPattern);
    expect(confirmEmail).toHaveBeenCalledTimes(1);
    expect(res.redirect).toBeTruthy();
    expect(res.statusCode).toBe(302);
  });

  it('Redirects back to Home Page if User already present in DB', async () => {
    const user = new User(fakeConfirmedUser);
    await user.save();
    const res = await request(app).post('/register').send(fakeInput).expect('Location', '/');

    expect(res.text).toMatch('Found. Redirecting to /');
    expect(res.redirect).toBeTruthy();
    expect(confirmEmail).toHaveBeenCalledTimes(0);
    expect(res.statusCode).toBe(302);
  });

  it('Returns statusCode 400 if missing email', async () => {
    const res = await request(app).post('/register').send({ name: fakeInput.name });

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(400);
    expect(res.clientError).toBeTruthy();
    expect(res.badRequest).toBeTruthy();
  });

  it('Returns statusCode 400 if missing name', async () => {
    const res = await request(app).post('/register').send({ email: fakeInput.email });

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(400);
    expect(res.clientError).toBeTruthy();
    expect(res.badRequest).toBeTruthy();
  });

  it('Returns statusCode 400 if missing both fields', async () => {
    const res = await request(app).post('/register');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(400);
    expect(res.clientError).toBeTruthy();
    expect(res.badRequest).toBeTruthy();
  });
});

describe('GET /confirm/:confirmationCode', () => {
  it("Changes isValid status from 'false' to 'true'", async () => {
    const user = new User(fakeUnconfirmedUser);
    await user.save();
    const regexPattern = /Found. Redirecting to \/status\/\S{42}\/confirmed/;

    const res = await request(app).get(`/confirm/${fakeUnconfirmedUser.confirmationCode}`);

    const newConfirmedUser = await User.findOne({ name: user.name });
    expect(user.isValid).toBeFalsy();
    expect(newConfirmedUser.isValid).toBeTruthy();
    expect(res.text).toMatch(regexPattern);
    expect(res.statusCode).toBe(302);
  });

  it('Redirects back to confirmed page if already confirmed', async () => {
    const user = new User(fakeConfirmedUser);
    await user.save();
    const regexPattern = /Found. Redirecting to \/status\/\S{42}\/confirmed/;

    const res = await request(app).get(`/confirm/${fakeConfirmedUser.confirmationCode}`);

    const newConfirmedUser = await User.findOne({ name: user.name });
    expect(user.isValid).toBeTruthy();
    expect(newConfirmedUser.isValid).toBeTruthy();
    expect(res.text).toMatch(regexPattern);
    expect(res.statusCode).toBe(302);
  });
});

describe('DELETE /unsubscribe/:uuid', () => {
  it('Deletes User from the DB if found', async () => {
    const user = new User(fakeUnconfirmedUser);
    await user.save();

    const userFound = await User.findOne({ name: user.name });
    expect(userFound).toBeDefined();

    const res = await request(app).delete(`/unsubscribe/${fakeConfirmedUser.uuid}`);

    const userStillExists = await User.findOne({ name: user.name });
    expect(userStillExists).toBeNull();
    expect(res.text).toMatch('/goodbye');
    expect(res.statusCode).toBe(302);
  });

  it("Returns Error code 400, redirects to error page if user doesn't exist", async () => {
    const res = await request(app).delete(`/unsubscribe/${fakeConfirmedUser.uuid}`);

    const user = await User.findOne({ name: fakeConfirmedUser.name });
    expect(user).toBeNull();
    expect(res.text).toMatch('<h4 class="alert-heading">ERROR: 400, User not found</h4>');
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /status/:uuid/:status', () => {
  it('Returns Success code 200 for valid states and valid user', async () => {
    const user = new User(fakeUnconfirmedUser);
    await user.save();
    const statuses = ['pending', 'confirmed', 'unsubscribe'];

    expect.assertions(3);
    for (state of statuses) {
      const res = await request(app).get(`/status/${fakeConfirmedUser.uuid}/${state}`);
      expect(res.statusCode).toBe(200);
    }
  });

  it('Returns Error code 400 for valid states and invalid user', async () => {
    const statuses = ['pending', 'confirmed', 'unsubscribe'];

    expect.assertions(3);
    for (state of statuses) {
      const res = await request(app).get(`/status/${fakeConfirmedUser.uuid}/${state}`);
      expect(res.statusCode).toBe(400);
    }
  });

  it('Returns Error code 404 for invalid states', async () => {
    const user = new User(fakeConfirmedUser);
    await user.save();
    const statuses = ['fakestate', 'skatesfake', ''];

    expect.assertions(3);
    for (state of statuses) {
      const res = await request(app).get(`/status/${fakeConfirmedUser.uuid}/${state}`);
      expect(res.statusCode).toBe(404);
    }
  });
});

describe('GET /goodbye', () => {
  it('Returns correct HTML page with StatusCode 200', async () => {
    const res = await request(app).get('/goodbye');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(
      '<p>Successfully unsubscribed. You will no longer receive Daily Quotes. :(</p>'
    );
  });
});
