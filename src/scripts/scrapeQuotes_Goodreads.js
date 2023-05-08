const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const scrapePage = async () => {
  const baseURL = 'https://www.goodreads.com/quotes';
  let pageURL = '?page=1';

  // Store all quote details
  const quoteDetails = [];

  let page = 1;
  while (page <= 100) {
    try {
      const url = baseURL + pageURL;

      // Get HTML from website
      const { data } = await axios.get(url);

      // Load HTML in parser
      const $ = cheerio.load(data);

      // Remove all <br> tags in page HTML
      $('br').each(function (idx) {
        $(this).prepend(' ');
        $(this).append(' ');
      });

      // Get all quotes details
      const quotes = $('.quoteDetails');

      // Loop through each quote to pull details
      quotes.each((idx, el) => {
        const quote = { body: '', author: '', title: '' };

        quote.body = $(el)
          .children('.quoteText')
          .text()
          .split('―')[0]
          .replace(/\n/g, ' ')
          .trim()
          .replace(/\s{2,}/g, '\n');

        quote.author = $(el)
          .children('.quoteText')
          .children('span')
          .first()
          .text()
          .replace(/\n/g, '')
          .trim();

        if (quote.author.endsWith(',')) {
          quote.author = quote.author.slice(0, -1);
        }

        quote.title = $(el)
          .children('.quoteText')
          .children('span')
          .first()
          .next()
          .text()
          .replace(/\n/g, '')
          .trim();

        quoteDetails.push(quote);
      });

      console.log('Page ' + page.toString() + ' scraped');
      await new Promise((r) => setTimeout(r, 2000));
      page += 1;
      pageURL = '?page=' + page.toString();
    } catch (error) {
      console.error(error);
      return;
    }
  }

  fs.writeFile('./seeds/Quotes.json', JSON.stringify(quoteDetails, null, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

scrapePage();
