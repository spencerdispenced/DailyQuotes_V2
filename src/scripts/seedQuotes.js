

const db = require('../utils/dbHandler');
const { addQuotesToDB } = require('./seeds/addQuotesToDB');

const seedQuotes = async () => {
  try {
    await db.connect();
    if (process.argv[2] !== '-all') {
      await addQuotesToDB(process.argv[2]);
    } else {
      await addQuotesToDB();
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.disconnect();
  }
};

seedQuotes();
