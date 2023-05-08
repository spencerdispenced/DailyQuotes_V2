const confirmEmail = require('../../../src/services/confirmEmail');
const { getTransporter } = require('../../../src/utils/getTransporter');

jest.mock('../../../src/utils/getTransporter');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Confirm Email service', () => {
  it('Calls create transporter, calls sendmail', async () => {
    const mockTransporter = { sendMail: jest.fn() };
    getTransporter.mockReturnValue(mockTransporter);
    await confirmEmail({}, {}, {});
    expect(getTransporter).toBeCalledTimes(1);
    expect(mockTransporter.sendMail).toBeCalledTimes(1);
  });
});
