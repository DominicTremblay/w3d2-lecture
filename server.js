const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

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

const quoteComments = {
  '70fcf8bd': {
    id: '70fcf8bd',
    comment: 'So awesome comment!',
    quoteId: 'd9424e04',
  },
  g89if43e: {
    id: 'g89if43e',
    comment: 'So awesome comment!',
    quoteId: '4ad11feb',
  },
};

// HELPER FUNCTIONS

const addNewQuote = content => {

  // generate an id for the new quote
  const id = Math.random().toString(36).substr(2,8);

  // {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }

  // create a new quote object
  const newQuote = {
    id: id,
    quote: content
  };

  // Add it to movieQuotesDb
  movieQuotesDb[id] = newQuote;

  // return the id of the quote
  return id;

}

const updateQuote = (id, content) => {
  movieQuotesDb[id].quote = content;
}


// END POINTS OR ROUTES

app.get('/', (req, res) => {

  res.redirect('/quotes');
})


// List of movieQuotes - READ

app.get('/quotes', (req, res) => {

  const movieQuotes = Object.values(movieQuotesDb);

  const templatevars = {movieQuotesArr: movieQuotes};  

  res.render('quote_list', {movieQuotesArr: movieQuotes});

});

// Display the form to add a new quote - READ
app.get('/quotes/new', (req, res) => {

  res.render('quote_new');

});

// Create a new quote (add it to the db) - CREATE

app.post('/quotes', (req, res) => {

  // Extract the information contained in the form
  // req.body

  console.log(req.body);
  // {quote_content: 'Over My Dead Body'}

  const content = req.body['quote_content'];

  console.log("CONTENT", content);

  // Create a new quote in the db
  const quoteId = addNewQuote(content);

  // redirect to /quotes
  res.redirect('/');

  // res.send("Quote added");


});

// Display the update form - READ
app.get('/quotes/:id/update', (req, res) => {

  // extract the quote id from the url
  // req.params

  console.log("PARAMS", req.params);

  const quoteId = req.params.id; 
  // we to get that quote from the db

  const quoteObj = movieQuotesDb[quoteId];

  const templatevars = {quoteObj: quoteObj}

  // display the update form

  res.render('quote_show', templatevars);


});


// PUT (POST) to update the quote in the db

app.post('/quotes/:id', (req, res) => {
  // Extract the quote id from the url
  // req.params

  const quoteId = req.params.id;

  // Extract the quote content from the form
  // req.body

  const content = req.body.quote_content;  

  // Update the quote in the db

  updateQuote(quoteId, content);

  // redirect to /quotes

  res.redirect('/quotes');

});

// delete a quote from the DB - DELETE (POST)
app.post('/quotes/:id/delete', (req, res) => {

  console.log("DELETE HERE");

  // extract the id from the url
  // req.params
  const quoteId = req.params.id;
  // delete it from the db
  delete movieQuotesDb[quoteId];

  // redirect to /quotes
  res.redirect('/quotes');

});






app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
