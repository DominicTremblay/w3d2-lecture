const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Setting ejs as the template engine - ejs, pug, handlbars...
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

// helper functions
// addNewQuote()
// UpdateQuote()
// Delete()

// END POINTS OR ROUTES
// Route = VERB + PATH

app.get('/', (req, res) => {
  res.send('Welcome to the movie quotes app!');
});

app.get('/quotes.json', (req, res) => {


  res.json(movieQuotesDb);
});

// CRUD Operations on quotes

// Get a list of all the quotes
// verb: GET path: '/quotes'

app.get('/quotes', (req, res) => {
  // Why?
  // provide the list of quotes to the view (quote_list);
  const templateVars = { quoteList: movieQuotesDb };

  // render the ejs file => Express is going to look in the views folder
  res.render('quote_list', templateVars);
});

// Create a movie quote
// Display the new form: verb: 'GET' path: '/quotes/new'
// Add => verb: 'POST' path: /quotes

// Display the new form
app.get('/quotes/new', (req, res) => {

  const templateVars = {}

  res.render('new_quote', templateVars);
});

// add the quote in the db
app.post('/quotes', (req, res) => {

  // extract the quote content from the post request
  const quoteContent = req.body.quoteContent;

  // create a new entry in the db
  const movieId = Math.random().toString(36).substring(2,8);

  const movieQuoteObj = {
    id: movieId,
    quote: quoteContent
  }

  movieQuotesDb[movieId] = movieQuoteObj;

  // display show page => redirect

  res.redirect(`/quotes/${movieId}`)


})

// Display a single movie quote
// Display the movie quote => Verb:GET Path: /quotes/:id
// Click on Update => verb: POST Path: /quotes/:id
app.get('/quotes/:id', (req, res) => {
  const movieId = req.params.id;

  console.log(req.params);
  const templateVars = { quoteObj: movieQuotesDb[movieId] };

  res.render('quote_show', templateVars);
});



// UPDATE QUOTE
app.post('/quotes/:id', (req, res) => {
  // extract the id of the quote (if the var is in the url => req.params)
  const movieId = req.params.id;

  // extract the quote string for the post request (when it's from a form => req.body)
  const quoteContent = req.body.quoteContent;

  // Update that quote in the db
  movieQuotesDb[movieId].quote = quoteContent;

  // redirect to '/quotes' => another get request bythe browser to /quotes
  res.redirect('/quotes');
});






// Delete the movie quote
// verb: DELETE Path: /quotes/:id
// verb: POST path: /quotes/:id/delete (because delete is not accepted)

app.post('/quotes/:id/delete', (req, res) => {

  // extract the id from the url => req.params
  const movieId = req.params.id;
  // delete the entry in the database
  delete movieQuotesDb[movieId];
  // redirect to /quotes
  res.redirect('/quotes');
});


app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
