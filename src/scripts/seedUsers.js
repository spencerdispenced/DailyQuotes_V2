const db = require('../utils/dbHandler');
const { seedFakeUsers } = require('../../tests/testUtils/seedFakeUsers');

const seedUsers = async () => {
  try {
    await db.connect();
    if (isNaN(parseInt(process.argv[2]))) {
      await seedFakeUsers();
    } else {
      await seedFakeUsers(process.argv[2]);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.disconnect();
  }
};

seedUsers();
