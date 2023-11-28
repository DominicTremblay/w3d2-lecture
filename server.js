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

app.get('/quotes.json', (req, res) => {
  res.json(movieQuotesDb);
});

// CRUD Operations on quotes

// LIST OF QUOTES
// Get a list of quotes
// READ
// Path or the url: /quotes

app.get('/quotes', (req, res) => {
  // get the quotes from the db

  // Pass it to the template
  // if we don't => the view does not have access to it

  // render the view => ejs = HTML + JS => compiled => HTML
  res.render('quotes_list', {
    title: 'List of Movie Quotes...',
    movieQuotesList: movieQuotesDb,
  }); // render => filename
});

// CREATE A NEW QUOTE

// Display the form to add a new quote
app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

// Process the form that it receives
app.post('/quotes', (req, res) => {
  // extract the quote content from the body of the request
  console.log(req.body); // { quoteContent: 'Here’s Johnny!!!!' }

  // We need to add the quote the db
  // we need a new id
  const id = Math.random().toString(36).substring(2, 8);

  // add the new quote to the db
  // nameOfObject[newKey] = value => {id: 123, quote: 'abc'}
  movieQuotesDb[id] = {
    id,
    quote: req.body.quoteContent,
  };

  res.redirect('/quotes'); // ask the browser to perform another get /quotes
});

// UPDATE AN EXISTING QUOTE
// Display an existing quote on the screen

app.get('/quotes/:id', (req, res) => {
  // extract the id from the path (url)
  const id = req.params.id;

  res.render('quote_show', { quoteContent: movieQuotesDb[id] });
});

// Update the quote
app.post('/quotes/:id', (req, res) => {
  // extract the id from the path
  const id = req.params.id;

  // we need to extract the updated quote
  // bodyParser => req.body
  const quoteContent = req.body.quoteContent;

  // updating the quote in the db
  movieQuotesDb[id].quote = quoteContent;

  // redirect

  res.redirect('/quotes');
});

app.post('/quotes/:id/delete', (req, res) => {
  // extract the id from the path
  const id = req.params.id;

  delete movieQuotesDb[id];

  res.redirect('/quotes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
