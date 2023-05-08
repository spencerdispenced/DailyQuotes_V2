const app = require('./src/app');
const PORT = process.env.PORT || 3000;
const database = require('./src/utils/dbHandler');

database.connect();

app.listen(PORT, () => {
  console.log(`APP IS LISTENING ON PORT ${PORT}`);
});
