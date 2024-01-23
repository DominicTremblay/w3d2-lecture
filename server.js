const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded => req.body
// replacing bodyParser
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
};

// END POINTS OR ROUTES

app.get('/', (req, res) => {
  res.send('Welcome to the movie quotes app!');
});

// CRUD Operations on quotes

// READ
// list of quotes
app.get('/quotes', (req, res) => {
  // get the list of quotes from the database

  // render the view to send back the HTML
  res.render('quote_list', {
    title: 'List of Quotes',
    quotesList: movieQuotesDb,
  });
});

// CREATE
// extract the info from the form
// create a new quote
// 2 routes => displaying the form, submit the form

// display the form
app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

// deal with the form submission
app.post('/quotes', (req, res) => {
  // extract the quote from the form
  const quote = req.body.quoteContent;

  // create a new value-pair in movieQuotesDB
  // create a new id
  const quoteId = Math.random().toString(36).substring(2, 8);

  // push it to movieQuotesDB
  movieQuotesDb[quoteId] = {
    id: quoteId,
    quote,
  };

  // redirect to /quote => ask the browser to create a new request get /quotes

  res.redirect('/quotes');
});

// UPDATE
// we want to change an existing quote
// display the quote that we want to change
// resubmit with the change

// display the quote
app.get('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;

  const quoteObj = movieQuotesDb[quoteId];

  res.render('quote_show', { quoteObj });
});

app.post('/quotes/:id', (req, res) => {
  // extract the id from the url
  const quoteId = req.params.id;

  // extract the quote from req.body
  const newQuote = req.body.quoteContent;

  // update the moviesQuoteDB and reassign
  movieQuotesDb[quoteId].quote = newQuote;

  // redirect to /quote

  res.redirect('/quotes');
});

// DELETE
// delete an existing quote

app.post('/quotes/:id/delete', (req, res) => {
  // extract the id
  const quoteId = req.params.id;
  // delete the quote from the database

  delete movieQuotesDb[quoteId];

  // redirect
  res.redirect('/quotes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
