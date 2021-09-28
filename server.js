const express = require('express');
const morgan = require('morgan'); // middleware

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded => req.body
// replacing bodyParser
app.use(express.urlencoded({ extended: true })); // middleware => body parser

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

// READ (list the quotes from the db (moviesQuotesDb))
// routes === end points (same thing)

app.get('/quotes', (req, res) => {
  console.log('Listing of the quotes');

  // get the data from the db (list of quotes)

  // render the page using that data
  // sending back the response

  // SQL Querie
  // SELECT * FROM quotes; => list of quotes from the db
  // We don't a real db, so we're passing the object itself => manipualte that object

  const templateVars = { quoteList: movieQuotesDb };

  res.render('quotes_list', templateVars);
});

// CREATE (add a new quote to the db)
// 2 end points
// a. we need to display a form
// b. we need to post the form

app.get('/quotes/new', (req, res) => {
  res.render('new_quote');
});

app.post('/quotes', (req, res) => {
  // req.body = {
  //   quoteContent: 'Why so serious????'
  // }

  // extract the data from the body of the request (headers + body: info from form)
  console.log('quote:', req.body); // req.body
  const quote = req.body.quoteContent;

  // insert the data in the db
  // nameOfObject[newKey] = value

  const quoteId = Math.random().toString(36).substring(2, 8);

  movieQuotesDb[quoteId] = {
    id: quoteId,
    quote: quote,
  };

  // redirect to quote list (no renders)
  res.redirect('/quotes'); // ask the browser to perform 'GET /quotes'
});

// UPDATE (update an existing quote in the db)
// a. display the update form
// b. post request to update the data in the db

app.get('/quotes/:id', (req, res) => {
  console.log('id:', req.params.id);
  const quoteId = req.params.id;

  const templateVars = {
    quoteId: quoteId,
    quote: movieQuotesDb[quoteId].quote,
  };

  res.render('quote_show', templateVars);
});

app.post('/quotes/:id', (req, res) => {
  // extract the quote id from the url => req.params
  const quoteId = req.params.id;

  // extract the quote content from the form => req.body
  const quoteContent = req.body.quoteContent;

  // update the quote content in the db associated with that quote Id
  movieQuotesDb[quoteId].quote = quoteContent;

  // redirect to /quotes
  res.redirect('/quotes');
});

// DELETE (remove a quote from the db)

app.post('/quotes/:id/delete', (req, res) =>{
// delete that id from the object

})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
