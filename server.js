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
    quote: "What doesn't kill you simply makes you stranger!",
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

// READ => display a list of quotes
app.get('/quotes', (req, res) => {
  const templateVar = { name: 'Bob', movieQuotesDb };

  res.render('quote_list', templateVar);
});

// CREATE => add a new quote in the db from the info in a form

app.get('/quotes/new', (req, res) => {
  const templateVar = { name: 'Bob' };
  res.render('new_quote', templateVar);
});

// receive the information from the form => request body
app.post('/quotes', (req, res) => {
  // access the user input (info from the form)
  // const quoteContent = req.body.quoteContent;
  const { quoteContent } = req.body;

  // we need a new id
  const id = Math.random().toString(36).substring(2, 8);

  //create a new entry in movieQuotesDb

  movieQuotesDb[id] = {
    id,
    quote: quoteContent,
  };

  // redirect to /quotes
  res.redirect('/quotes'); // ask the browser to do another get /quotes
});

// UPDATE
// Display the update form
app.get('/quotes/:id', (req, res) => {
  // retreive the quote to display

  const { id } = req.params;

  //   {
  //   id: 'd9424e04',
  //   quote: "What doesn't kill you simply makes you stranger!",
  // }

  const movieQuote = movieQuotesDb[id];

  const templateVar = {
    name: 'Bob',
    id: movieQuote.id,
    content: movieQuote.quote,
  };

  console.log(templateVar);

  res.render('quote_show', templateVar);
});

// /quotes/:id => to get to a single quote
// update => PUT => POST
// when we click the submit on the form, this get triggered >
app.post('/quotes/:id', (req, res) => {
  // extract the information from the form

  const { quoteContent } = req.body;

  // extract the id from url
  const { id } = req.params;

  // update the quote with that quoteId in moviesDb

  movieQuotesDb[id].quote = quoteContent;

  // redirect to /quotes
  res.redirect('/quotes');
});

// DELETE

app.post('/quotes/:id/delete', (req, res) => {
  // extraction the id we need to delete from the url of the request
  const { id } = req.params;

  delete movieQuotesDb[id];

  res.redirect('/quotes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
