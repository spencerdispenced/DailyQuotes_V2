const nodemailer = require('nodemailer');

module.exports.getTransporter = () => {
  const auth = {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  };

  let mailConfig;
  if (process.env.NODE_ENV === 'production') {
    mailConfig = { service: 'gmail', auth };
  } else {
    mailConfig = { host: 'smtp.ethereal.email', port: 587, auth };
  }

  const transporter = nodemailer.createTransport(mailConfig);
  return transporter;
};
