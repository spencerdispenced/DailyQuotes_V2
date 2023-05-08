const { sendQuoteEmail } = require('../../tests/testUtils/quoteEmails');
const db = require('../utils/dbHandler');

const sendEmails = async () => {
  try {
    await db.connect();
    await sendQuoteEmail();
  } catch (error) {
    console.log(error);
  } finally {
    await db.disconnect();
  }
};

sendEmails();
