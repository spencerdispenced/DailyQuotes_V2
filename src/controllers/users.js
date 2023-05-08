const confirmEmail = require('../services/confirmEmail');
const ExpressError = require('../utils/ExpressError');
const UserService = require('../services/userService');

const Status = {
  pending: 'pending',
  confirmed: 'confirmed',
  unsubscribe: 'unsubscribe',
};

module.exports.createNewUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await UserService.addUser(name, email);
    res.redirect(`/status/${user.uuid}/pending`);
    confirmEmail(user.name, user.email, user.confirmationCode);
    return user;
  } catch (error) {
    if (error.code === 11000) {
      req.flash('error', 'Email already used!');
      res.redirect('/');
    } else {
      next(error);
      return error;
    }
  }
};

module.exports.confirmSignup = async (req, res, next) => {
  const user = await UserService.findUserByCode(req.params.confirmationCode);
  if (!user) throw new ExpressError('User not found', 400);

  if (user.isValid === true) {
    req.flash('success', 'You already confirmed!');
  } else {
    UserService.confirmUser(user);
  }
  res.redirect(`/status/${user.uuid}/confirmed`);
  return user;
};

module.exports.renderStatusPage = async (req, res, next) => {
  const { uuid, status } = req.params;
  const user = await UserService.findUserById(uuid);
  if (!user) throw new ExpressError('User not found', 400);

  if (!(status in Status)) throw new ExpressError('Page not found', 404);

  return res.render(`users/${status}`, { user });
};

module.exports.deleteUser = async (req, res, next) => {
  const uuid = req.params.uuid;
  const user = await UserService.findUserById(uuid);

  if (!user) throw new ExpressError('User not found', 400);
  await UserService.deleteUser(uuid);
  res.redirect(`/goodbye`);
};

module.exports.renderUnsubcribedPage = (req, res) => {
  return res.render('users/goodbye');
};
