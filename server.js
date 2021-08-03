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
    quote: 'The greatest teacher, failure is',
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

// READ => List all the quotes from our database (movieQuotesDb)
app.get('/quotes', (req, res) => {
  // get the list of quotes from the database (movieQuotesDB)
  // create a placeholder variable
  const templateVars = { quoteList: movieQuotesDb };
  // create an ejs file and render it. => display the list of quotes
  res.render('quote_list', templateVars);
});

// UPDATE THE QUOTE IN THE DB
app.post('/quotes/:id', (req, res) => {
  // extract the id from params
  const quoteId = req.params.id;
  // extract the new quote value from the form => req.body
  const quoteContent = req.body.quoteContent; // quoteContent comes from what???

  // update the quote content for that id
  movieQuotesDb[quoteId].quote = quoteContent;

  // redirect to get /quotes (list of quotes)
  res.redirect('/quotes');
});

// CREATE A NEW QUOTE
// DISPLAY THE NEW FORM

app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});
// CREATE AND ADD THE QUOTE TO THE DATABASE
app.post('/quotes', (req, res) => {
  // extract the new quote from the form
  // middleware => body parser => req.body
  const quoteContent = req.body.quoteContent;
  console.log(req.body);
  // Post request
  // 2 parts:
  // 1) headers (info: method GET path: /quotes)
  // 2) body (content of the form)

  // add to the database object with the new quote
  // {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }
  // create a random ID
  const quoteId = Math.random().toString(36).substring(2, 8);

  const newQuote = {
    id: quoteId,
    quote: quoteContent,
  };

  // add the new quote in the movieQuotesDb
  movieQuotesDb[quoteId] = newQuote;

  // redirect to list of quotes
  res.redirect('/quotes'); // => trigger a new get request => get /quotes
});

// Update of a quote
// 2 routes:
// 1) display the specific quote
// 2) update that quote content in the database object

// display the update form
app.get('/quotes/:id', (req, res) => {
  // :id => placehoder
  // extract the id value => req.params
  const quoteId = req.params.id; // => ex: 917d445c

  // movieQuotesDb[quoteId]
  // value:
  // {
  //   id: '917d445c',
  //   quote: 'The greatest teacher, failure is.',
  // }

  const templateVars = {
    quoteId: quoteId,
    quoteContent: movieQuotesDb[quoteId].quote,
  };

  // render the quote_show to display that quote
  res.render('quote_show', templateVars);
});

// DELETE A QUOTE

app.post('/quotes/:id/delete', (req, res) => {
  // extract the id => req.params
  const quoteId = req.params.id;

  // delete it from the database
  delete movieQuotesDb[quoteId];

  // redirect to get quotes

  res.redirect('/quotes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
