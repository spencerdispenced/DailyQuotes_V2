const Quote = require('../../src/models/quote');

module.exports.seedFakeQuote = async () => {
  try {
    await Quote.deleteMany({});
    
    const quote = new Quote({
      body: '"Be yourself; everyone else is already taken."',
      author: 'Oscar Wilde',
      title: '',
    });
    await quote.save();
    
  } catch (error) {
    console.log('Error seeding Quotes');
    console.log(error);
  }
};