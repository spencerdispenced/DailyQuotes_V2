const Quote = require('../../models/quote');
const quoteData = require('./Quotes.json');

module.exports.addQuotesToDB = async (seedAmount = quoteData.length) => {
  try {
    await Quote.deleteMany({});
    for (let i = 0; i < seedAmount; i++) {
      const quote = new Quote({
        body: quoteData[i].body,
        author: quoteData[i].author,
        title: quoteData[i].title,
      });
      await quote.save();
    }
  } catch (error) {
    console.log('Error seeding Quotes');
    console.log(error);
  }
};
