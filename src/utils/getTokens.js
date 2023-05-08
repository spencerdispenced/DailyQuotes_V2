const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports.getTokens = (email) => {
  const tokens = {
    confirmationCode: jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION,
    }),
    uuid: crypto.randomBytes(21).toString('hex'),
  };
  if (tokens.confirmationCode && tokens.uuid) {
    return tokens;
  } else {
    return undefined;
  }
};
