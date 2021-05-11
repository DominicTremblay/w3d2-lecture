const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded => req.body
app.use(express.urlencoded({ extended: true }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Setting ejs as the template engine
app.set('view engine', 'ejs');

// In memory database
const movieQuotesDb = {
  d9424e04: {
    id: 'd9424e04',
    quote: 'Why so serious?',
  },
  '27b03e95': {
    id: '27b03e95',
    quote: 'YOU SHALL NOT PASS!',
  },
  '5b2cdbcb': {
    id: '5b2cdbcb',
    quote: "It's called a hustle, sweetheart.",
  },
  '917d445c': {
    id: '917d445c',
    quote: 'The greatest teacher, failure is.',
  },
  '4ad11feb': {
    id: '4ad11feb',
    quote: 'Speak Friend and Enter',
  },
  '9o4re3w3': {
    id: '9o4re3w3',
    quote: 'GET OUT OF MY SWAMP!',
  },
  '3y5e7w8f': {
    id: '3y5e7w8f',
    quote: 'Do the roar!',
  },
  '2a3f6y9l': {
    id: '2a3f6y9l',
    quote: 'Ogres are like onions!',
  },
};

// END POINTS OR ROUTES

app.get('/', (req, res) => {
  res.send('Welcome to the movie quotes app!');
});

// CRUD Operations on quotes
// ROUTE (Endpoint) => http verb (method) + path(url)
app.get('/quotes', (req, res) => {
  const templateVars = { movieQuotes: movieQuotesDb };

  res.render('quote_list', templateVars);
});

// ADD A NEW QUOTE
// display the form to add a quote
app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

// create the quote
app.post('/quotes', (req, res) => {
  // steps
  // extract the quote content from the body of the request => req.body (name)
  const { quoteContent } = req.body;

  // create a random id
  const quoteId = Math.random().toString(36).substring(2, 8);
  // create a new quote object
  const newQuote = {
    id: quoteId,
    quote: quoteContent,
  };

  // Add the new quote to the db
  // nameofOBject[newKey] = value;
  movieQuotesDb[quoteId] = newQuote;

  // redirect

  res.redirect('/quotes');
});

// UPDATE A QUOTE

// display the show page (update form)
app.get('/quotes/:id/update', (req, res) => {
  const { id } = req.params;

  const templateVars = { quoteId: id, quoteContent: movieQuotesDb[id].quote };

  res.render('quote_show', templateVars);
});

// actually perform the update in the database
app.post('/quotes/:id', (req, res) => {
  // steps?
  // Extract the id from req.params
  const { id } = req.params;

  // Extract the quote content from req.body
  const { quoteContent } = req.body;

  // update the quote content for that quote id in the db
  // nameOfObject[existingKey].quote = newQuoteContent

  movieQuotesDb[id].quote = quoteContent;

  // Redirect to /quotes
  res.redirect('/quotes');
});

// DELETE QUOTE

app.post('/quotes/:id/delete', (req, res) => {
  // extract the quote id from the path => req.params
  const { id } = req.params;

  // delete the entry in the db for that id

  delete movieQuotesDb[id];

  // redirect to /quotes
  res.redirect('/quotes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
