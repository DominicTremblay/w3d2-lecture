const e = require('express');
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

app.get('/quotes.json', (req, res) => {
  res.json(movieQuotesDb);
});

// CRUD

// CREATE A QUOTE

// GET /quotes/new => display the form the the user

app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

// POST /quotes => add the new quote
app.post('/quotes', (req, res) => {
  // Get the data of the new quote from the user (form in the browser)
  const quote = req.body.quoteContent;
  // Add this new quote into the database
  // const movieQuotesDb = {
  //   d9424e04: {
  //     id: 'd9424e04',
  //     quote: 'Why so serious?',
  //   },

  // generating a random id
  const id = Math.random().toString(36).substring(2, 8);

  movieQuotesDb[id] = {
    id: id,
    quote: quote,
  };

  // asking the browser to perform a get /quotes
  res.redirect('/quotes');
});

// redirect to /quotes => display the list of quotes

// READ: GET A LIST OF QUOTES

app.get('/quotes', (req, res) => {
  const templateVar = { title: 'My Quotes', moviesDb: movieQuotesDb };
  // render a view:
  res.render('quote_list', templateVar);
});

// UPDATE A QUOTE

// show a quote
app.get('/quotes/:id', (req, res) => {
  // extract the id from the url
  const id = req.params.id;

  // find the quote with that id from the movieQuotesDb

  const quoteFound = movieQuotesDb[id];

  // Display the quote
  const templateVar = { quoteFound };

  res.render('quote_show', templateVar);
});

// update (PUT > POST)
app.post('/quotes/:id', (req, res) => {
  console.log('params:', req.params);
  console.log('body:', req.body);

  // extract the id from the url => req.params
  const id = req.params.id;

  // extract the updated quote from the body (form) => req.body
  const quoteContent = req.body.quoteContent;

  // update the database
  movieQuotesDb[id].quote = quoteContent;

  // redirect to /quotes => the list of quotes
  res.redirect('/quotes');
});

// DELETE A QUOTE

app.post('/quotes/:id/delete', (req, res) => {
  // extract the id
  const id = req.params.id;

  // delete from the database
  delete movieQuotesDb[id];

  // redirection to /quotes
  res.redirect('/quotes');
});

// CRUD Operations on quotes

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
