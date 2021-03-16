const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));
// app.use(bodyParser.urlencoded({ extended: true }));

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



// END POINTS OR ROUTES

app.get('/', (req, res) => {
  res.send('Welcome to the movie quotes app!')
})


// CRUD Operations on quotes

// READ: Get the list of all the quotes

// READ: Display only one quote


// CREATE: Create a new quote
// a) Display the new form
// b) Add the new quote in the database

// UPDATE: Update a quote
// a) Display de update form 
// b) Update the quote in the database

// DELETE: Delete a quote
// Delete from the database


app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
