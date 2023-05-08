const nodemailer = require('nodemailer');
const { ImapFlow } = require('imapflow');

const { simpleParser } = require('mailparser');

module.exports.createAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log(`created new email account ${testAccount.user}`);
  console.log(`for debugging, the password is ${testAccount.pass}`);

  return testAccount;
};

module.exports.getLastEmail = async (user, pass) => {
  const client = new ImapFlow({
    host: 'ethereal.email',
    port: 993,
    secure: true,
    auth: {
      user,
      pass,
    },
    logger: false,
  });
  await client.connect();
  // Select and lock a mailbox. Throws if mailbox does not exist
  const lock = await client.getMailboxLock('INBOX');
  let message;
  try {
    message = await client.fetchOne(client.mailbox.exists, { source: true });
    
  } finally {
    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    await client.messageFlagsAdd({ seen: false }, ['\\Seen']);
    lock.release();
  }
  await client.logout();

  // If no message was received (message = false) then return message, to ensure that the task will retry
  // If a message is received return the source in order to parse its content
  if (!message) return message;
  return message.source;
};

module.exports.parseEmail = async (message) => {
  const source = Buffer.from(message);
  const mail = await simpleParser(source);

  return {
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: mail.attachments,
  };
};
