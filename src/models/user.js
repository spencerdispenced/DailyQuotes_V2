const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
  },
  uuid: {
    type: String,
    unique: true,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
