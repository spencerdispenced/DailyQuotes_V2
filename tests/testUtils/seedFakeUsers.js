const User = require('../../src/models/user');
const { fakeInput } = require('../fixtures/fakeNewUserData');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports.seedFakeUsers = async (seedAmount = 5) => {
  try {
    await User.deleteMany({});
    console.log(`Seeding ${seedAmount} users`);

    for (let i = 0; i < seedAmount; i++) {
      let name = fakeInput.name;
      let email = fakeInput.email.slice(0,16);

      const user = new User({
        name: `${name}${i + 1}`,
        email: `${email}+test${i + 1}@gmail.com`,
        confirmationCode: jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRATION,
        }),
        uuid: crypto.randomBytes(21).toString('hex'),
      });
      if (i % 2 === 0) {
        user.isValid = true;
      }
      await user.save();
    }
  } catch (error) {
    console.log('Error seeding Users');
    console.log(error);
  }
};
