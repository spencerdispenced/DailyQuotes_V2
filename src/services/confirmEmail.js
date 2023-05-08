const { getTransporter } = require('../utils/getTransporter');

const confirmEmail = async (name, recipient, confirmationCode) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    to: recipient,
    from: process.env.EMAIL_SENDER,
    subject: 'Daily Quotes email confirmation',
    html: `<div data-cy="confirm-email-body">
               <h1>Email Confirmation</h1>
               <h2>Hello ${name}</h2>
               <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
               <a href=${process.env.URL}/confirm/${confirmationCode}>Click here</a>
             </div>`,
  });
};

module.exports = confirmEmail;
