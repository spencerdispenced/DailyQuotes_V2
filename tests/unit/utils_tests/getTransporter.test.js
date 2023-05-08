const nodemailer = require('nodemailer');
const { getTransporter } = require('../../../src/utils/getTransporter');

const env = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...env };
  process.env.EMAIL_ID = 'FakeID';
  process.env.EMAIL_PASS = 'FakePass';

  spy = jest.spyOn(nodemailer, 'createTransport');
});
afterEach(() => {
  process.env = env;
});

describe('GetTransporter Utility function', () => {
  it('Creates Production transporter in Prod enironment', () => {
    process.env.NODE_ENV = 'production';
    getTransporter();
    expect(spy).toBeCalledWith({ service: 'gmail', auth: { user: 'FakeID', pass: 'FakePass' } });
    expect(spy).toBeCalledTimes(1);
  });

  it('Creates Development transporter in Dev enironment', () => {
    process.env.NODE_ENV = 'development';
    getTransporter();
    expect(spy).toBeCalledWith({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: 'FakeID', pass: 'FakePass' },
    });
    expect(spy).toBeCalledTimes(1);
  });
});
