const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
// app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Setting ejs as the template engine
app.set('view engine', 'ejs'); //pug, handlebars

// In memory database
const movieQuotesDb = {
  // d9424e04: {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // },
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

// const quoteComments = {
//   '70fcf8bd': {
//     id: '70fcf8bd',
//     comment: 'So awesome comment!',
//     quoteId: 'd9424e04',
//   },
//   g89if43e: {
//     id: 'g89if43e',
//     comment: 'So awesome comment!',
//     quoteId: '4ad11feb',
//   },
// };

// HELPER FUNCTIONS

const addNewQuote = (content) => {
  // generate a new id
  const quoteId = Math.random().toString(26).substring(2, 8);
  // create a new quote
  const newQuote = {
    id: quoteId,
    quote: content,
  };
  // add the quote to movieQuotesDb
  movieQuotesDb[quoteId] = newQuote;
  // return the quote id
  return quoteId;
};

const updateQuote = (quoteId, content) => {

  // get the quote using the quoteId from movieQuoteDb
  // update the content of the quote
  movieQuotesDb[quoteId].quote = content;

};

// END POINTS OR ROUTES

app.get('/', (req, res) => {
  res.send('Welcome to the movie quotes app!');
});

app.get('/quotes.json', (req, res) => {
  res.send(movieQuotesDb);
});

// CRUD Operations on quotes

// READ: Get the list of all the quotes

app.get('/quotes', (req, res) => {
  // req => request object containing all the info about the request
  // res => response object containing info about the response (also methods)

  // get the list of the quotes from the db
  // decision: Do I want to deal with the object or make it an array?
  const quoteList = Object.values(movieQuotesDb);

  const templateVars = { quotesArr: quoteList };

  // render a page a pass it the object
  res.render('display_quotes', templateVars);
});

// READ: Display only one quote

app.get('/quotes/:quoteId', (req, res) => {
  // extract the id info from the path
  // => req.params
  const quoteId = req.params.quoteId;
  console.log(quoteId);

  // retrieve the quote info from the db
  const quoteInfo = movieQuotesDb[quoteId];

  // provide data to the view
  const templateVars = { quoteObj: quoteInfo };

  res.render('quote_show', templateVars);
});

// CREATE: Create a new quote
// a) Display the new form (already taken care of: part of display_quote)
// b) Add the new quote in the database

app.post('/quotes', (req, res) => {
  // extract the quote info from the post request
  // req.body

  const quoteContent = req.body.quoteContent;

  console.log(quoteContent);
  // create a new quote in the database
  const quoteId = addNewQuote(quoteContent); // add the new quote in moviequoteDb;

  // redirect to the show page => create another get request
  res.redirect(`/quotes/${quoteId}`); // no ejs here & no template vars with a redirect
});

// UPDATE: Update a quote
// a) Display de update form (already taken care of in quote_show)
// b) Update the quote in the database

app.post('/quotes/:quoteId', (req, res) => {
  // extract the quote id form the path
  // req.params

  const quoteId = req.params.quoteId;

  // extract the content for the form
  // req.body
  const quoteContent = req.body.quoteContent;

  updateQuote(quoteId, quoteContent);

  // redirect to /quotes => no ejs, no template vars

  res.redirect('/quotes');
});

// DELETE: Delete a quote
// Delete from the database

app.post('/quotes/:quoteId/delete', (req, res) => {

// delete the quote from db
  delete movieQuotesDb[req.params.quoteId];
// redirect
  res.redirect('/quotes');

})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
