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
const jsJokesDb = {
  d9424e04: {
    id: 'd9424e04',
    question: 'Why was the JavaScript developer sad?',
    answer: "Because they didn't Node how to Express himself",
  },
  '27b03e95': {
    id: '27b03e95',
    question: 'What tool do you use to switch versions of node?',
    answer: ' dev1> nvm, I figured it out.',
  },
  '5b2cdbcb': {
    id: '5b2cdbcb',
    question: 'Why did the hungry dev multiply a string by an integer?',
    answer: 'He wanted some NaN bread',
  },
  '917d445c': {
    id: '917d445c',
    question: 'Why is JavaScript is a lot like English?',
    answer: 'No one knows how to use semicolons properly.',
  },
  '4ad11feb': {
    id: '4ad11feb',
    question: 'Why do JavaScripters wear glasses?',
    answer: "Because they don't C#",
  },
};

// END POINTS OR ROUTES

app.get('/', (req, res) => {
  res.send('Welcome to the top list of JavaScript jokes!');
});

// CRUD Operations on quotes

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
