require('dotenv').config({ path: './configs/.env.development' });
const User = require('../../../src/models/user');
const { seedFakeUsers } = require('../../testUtils/seedFakeUsers');
const { addQuotesToDB } = require('../../../src/scripts/seeds/addQuotesToDB');
const { sendQuoteEmail } = require('../../testUtils/quoteEmails');
//const db = require('../../../src/utils/dbHandler');
const fakeDB = require('../../testUtils/fakeDB');

beforeAll(async () => {
  await fakeDB.connect();
  await seedFakeUsers();
  await addQuotesToDB(1);
});

afterAll(async () => {
  await fakeDB.disconnect();
});

describe('Daily Quotes Emails', () => {
  it('Sends emails to confirmed users only', async () => {
    const unconfirmedUsers = (await User.find({ isValid: false })).map((user) => user.email);
    const confirmedUsers = (await User.find({ isValid: true })).map((user) => user.email);

    const sentMsgStatuses = await sendQuoteEmail();

    expect.assertions(sentMsgStatuses.length * 3);
    for (let receipient of sentMsgStatuses) {
      expect(confirmedUsers.includes(receipient.email)).toBe(true);
      expect(unconfirmedUsers.includes(receipient.email)).toBe(false);
      expect(receipient.msgStatus).toMatch('250 Accepted ');
    }
  }, 10000);
});
