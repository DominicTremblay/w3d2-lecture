const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('dev'));

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

// READ => displaying a list of quotes

app.get('/quotes', (req, res) => {
  // we to provide our view with the moviequotesDB

  const templateVars = { quotesListDb: movieQuotesDb };

  // render the view
  // send back a response
  res.render('quotes_pretty', templateVars);
});

// CREATE A NEW QUOTE

// Display the form
app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

app.post('/quotes', (req, res) => {
  // add new content to the the database

  // extract the quote from the request body (from an input field from the form)
  // const newQuote = req.body.quoteContent;
  const { quoteContent } = req.body; // req.body => when extracting from the form

  // generate a new id
  const newId = Math.random().toString(36).substring(2, 8);

  movieQuotesDb[newId] = {
    id: newId,
    quote: quoteContent,
  };

  res.redirect('/quotes'); // asks the browser to perform another GET /quotes
});

// SHOW ONE QUOTES
app.get('/quotes/:id', (req, res) => {
  // extract the id form the url (NOT the body of the request) => req.params <=> info in the url or path

  const { id } = req.params;
  console.log(req.params);

  // get the quote with that id from the db
  const quote = movieQuotesDb[id].quote;

  res.render('quote_show', { id, quote });
});

// UPDATE
app.post('/quotes/:id', (req, res) => {
  // get the id of quote
  const { id } = req.params;

  // get the content of the new quote
  const { quoteContent } = req.body;

  // update that quote in the db with the new content
  movieQuotesDb[id].quote = quoteContent;

  // redirect to /quotes
  res.redirect('/quotes');
});

// DELETE
app.post('/quotes/:id/delete', (req, res) => {
  // extract the id from the url =>req.params

  const { id } = req.params;

  delete movieQuotesDb[id];

  res.redirect('/quotes')
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
