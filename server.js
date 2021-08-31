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

// READ => List all the quotes
// GET /quotes

app.get('/quotes', (req, res) => {
  // pull the quotes from the object
  const templateVars = { quotesDb: movieQuotesDb };

  // render the view with the quotes from the db

  res.render('quote_list', templateVars);
});

// CREATE => create a new quote
// REST
// 2 routes:
// GET /quotes/new => display the form to add a new quote
// POST /quotes => actually create the new quote

app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

app.post('/quotes', (req, res) => {
  // extract the quote from the form

  // req.params? => when the info is part of the url
  // req.body? => when the info is traveling in the body of a request (form)

  const quoteContent = req.body.quoteContent;

  // create a new quote (generate a new id)
  const quoteId = Math.random().toString(36).substring(2, 8);
  // add the new quote to db
  movieQuotesDb[quoteId] = {
    id: quoteId,
    quote: quoteContent,
  };
  // redirect to /quotes
  res.redirect('/quotes'); // trigger a new get request to /quotes
});

// UPDATE => updating an existing quote
// 2 routes:
// GET /quotes/:id (SHOW)
// PUT /quotes/:id => POST /quotes/:id

app.get('/quotes/:id', (req, res) => {
  // extract the id => req.params
  const quoteId = req.params.id;

  // find the correspondind quote from the db
  const templateVars = {
    quoteId: movieQuotesDb[quoteId].id,
    quoteContent: movieQuotesDb[quoteId].quote,
  }; // value associated with the key => value || undefined

  res.render('quote_show', templateVars);
});


app.post('/quotes/:id', (req, res) => {
  // extract the id
  const quoteId = req.params.id; // quoteId

  // extract the updated quote from the form
  const quoteContent = req.body.quoteContent; // quote string

  // update the db
  movieQuotesDb[quoteId].quote = quoteContent;

  // redirect to /quotes
  res.redirect('/quotes')

});

// DELETE => deleting a quote
// DELETE /quotes/:id => POST /quotes/:id/delete

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
