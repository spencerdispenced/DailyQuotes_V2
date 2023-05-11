// Demo testing file for sending emails to users
// Version will be ported to AWS Lambda

const User = require('../../src/models/user');
const { getTransporter } = require('../../src/utils/getTransporter');

module.exports.sendQuoteEmail = async () => {
  try {
    const transporter = await getTransporter();
    
    //const quote = await Quote.aggregate().sample(1);
    const users = await User.find({ isValid: true });
    
    const sentMsgStatuses = [];
    for (const user of users) {
      const info = await transporter
        .sendMail({
          to: user.email,
          from: process.env.EMAIL_SENDER,
          subject: 'Here is your daily quote',
          html: `<table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
              <tr>
                  <td style= "font-style: italic; font-size: 14px;" class="esd-block-html">
                      <div data-cy="quote-email-body">
                          <p style= "" data-cy="quote-body">"Be yourself; everyone else is already taken."</p>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td style= "font-size: 14px;" class="esd-block-html">
                      <div data-cy="quote-email-body">
                          <p style= "margin-left: 15px; margin-top: 10px;" data-cy="quote-author">- Oscar Wilde</p>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td align="center" class="esd-block-spacer es-p20" style="font-size:0">
                      <table style= "margin-top: 50px;"border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                          <tbody>
                              <tr>
                                  <td style="border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 5px 0px;"></td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
      <div>
      <p data-cy="unsubscribe-msg">If you're sick of these quotes: <a data-cy="unsubscribe-link" href=http://localhost:3000/status/${user.uuid}/unsubscribe>Unsubscribe</a></p>
      <br>
      Please do not reply to this message
      </div>`,
        })
        .catch((err) => console.log(err));

      sentMsgStatuses.push({
        email: user.email,
        msgStatus: info.response,
      });
      console.log(`Email sent to ${user.name}`);
    }

    return sentMsgStatuses;
  } catch (error) {
    console.log(error);
  }
};
