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
    answer: 'dev1> nvm, I figured it out.',
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
  // res.send('Welcome to the top list of JavaScript jokes!');
  res.redirect('/jokes');
});
// CRUD Operations on quotes

// create a route => listing the jokes
// READ => GET

app.get('/jokes', (req, res) => {
  const templateVars = { jokesList: jsJokesDb };

  res.render('jokes_list', templateVars);
});

// CREATE
// Display the form => GET
// Submit the form => POST

app.get('/jokes/new', (req, res) => {
  // display the new form
  res.render('new_joke');
});

// add a new joke to our db
app.post('/jokes', (req, res) => {
  // Extract the question and answer from the form post
  // Body parser => req.body
  // form info = req.body
  const question = req.body.question;
  const answer = req.body.answer;

  // save it in the database
  const id = Math.random().toString(36).substring(2, 8);

  // adding a new key-value pair to our db
  // objectName[newKey] = value;
  jsJokesDb[id] = {
    id: id,
    question: question,
    answer: answer,
  };

  // redirect to /jokes

  res.redirect('/jokes');
});


// UPDATE 
// GET /jokes/id
// POST /jokes/id

app.get('/jokes/:id', (req, res) => {

  // extract the info from the url => req.params

  const jokeId = req.params.id;
  const question = jsJokesDb[jokeId].question;
  const answer = jsJokesDb[jokeId].answer;

  const templateVars = {question: question, answer: answer, id: jokeId};

  console.log(templateVars);

  res.render('joke_show', templateVars);

});

app.post('/jokes/:id', (req, res) => {

  // Exract the info from the form => req.body
  const question = req.body.question;
  const answer = req.body.answer;

  // extract the id from the url => req.params
  const jokeId = req.params.id;

  // Update the joke in the db
  jsJokesDb[jokeId].question = question;
  jsJokesDb[jokeId].answer = answer;

  // jsJokesDb[jokeId] = {
  //   id: jokeId,
  //   question,
  //   answer
  // }
  // redirect /jokes
  res.redirect('/jokes');

});

// DELETE
// POST /jokes/:id/delete

app.post('/jokes/:id/delete', (req, res) => {


  // extract the id from the url
  const jokeId= req.params.id;

  delete jsJokesDb[jokeId];

  res.redirect('/jokes');

})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
