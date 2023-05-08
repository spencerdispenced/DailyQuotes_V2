const User = require('../models/user');
const { getTokens } = require('../utils/getTokens');

module.exports = class UserService {
  static addUser = (name, email) => {
    const { confirmationCode, uuid } = getTokens(email);
    const user = new User({
      name,
      email,
      confirmationCode,
      uuid,
    });
    return user.save();
  };

  static findUserByCode = (confirmationCode) => {
    return User.findOne({ confirmationCode: confirmationCode });
  };

  static findUserById = (uuid) => {
    return User.findOne({ uuid });
  };

  static deleteUser = (uuid) => {
    return User.deleteOne({ uuid });
  };

  static confirmUser = (user) => {
    user.isValid = true;
    return user.save();
  };
};
