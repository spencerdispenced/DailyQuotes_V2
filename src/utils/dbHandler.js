const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB_URL);

    if (process.env.NODE_ENV === 'production') {
      console.log('Production DB connection open');
    } else {
      console.log('Development DB connection open');
    }
  } catch (error) {
    console.log('DB connection error:');
    console.log(error);
  }
};

module.exports.disconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log('DB connection closed');
  } catch (error) {
    console.log(error);
  }
};
