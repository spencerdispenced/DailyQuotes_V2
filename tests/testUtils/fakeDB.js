const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = MongoMemoryServer;

module.exports.connect = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoose.set('strictQuery', false);
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    mongoose.connect(uri, mongooseOpts);
  } catch (error) {
    console.log(error);
  }
};

module.exports.disconnect = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close(/*force:*/ true);
    await mongoServer.stop();
  } catch (error) {
    console.log(error);
  }
};
