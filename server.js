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
  res.status(200).send('Welcome to the top list of JavaScript jokes!');
});

// CRUD Operations on jokes

// READ
app.get('/jokes', (req, res) => {
  // coding here
  // list all the jokes

  // get the list of quotes from the db (jsJokesDb)

  // 2 options:
  //  1. Can transfor my db into an array (Object.vues(jsJokesDb))
  //  => 2. just pass in the db oject to the ejs file directly
  // note: the looping won't happend here

  // send back the response with the resource that was asked
  // the ejs file doesn't know anything about the server! It's totally blind.
  // You have to explicitely informed the ej what data it should have access to

  const templateVars = { jokesDb: jsJokesDb };

  res.render('jokes_list', templateVars);
});

// Create a new joke

// we need to diplay the form to get the user input
app.get('/jokes/new', (req, res) => {
  // render the form
  res.render('new_joke');
});

// this is cataching the request when the user click the add button on the form
app.post('/jokes', (req, res) => {
  // retrieve the post data (req.body) - body parser

  console.log(req.body);

  // const question = req.body.question;
  // const answer = req.body.answer;

  const { question, answer } = req.body;

  // genrate a new id
  const jokeId = Math.random().toString(36).substring(2, 8);

  // add it to the db
  jsJokesDb[jokeId] = {
    id: jokeId,
    question: question,
    answer: answer,
  };

  // display the new entry => redirect /jokes

  res.status(201).redirect('/jokes'); // generate a new request get /jokes
});

// display a single joke on the page
// :id <= this is behaving like a variable or a wildcard
app.get('/jokes/:id', (req, res) => {
  // extract the id from the path?
  const jokeId = req.params.id;

  // retrieve that specific joke object from the db
  console.log(jokeId);
  const jokeObj = jsJokesDb[jokeId];

  // pass the info of that joke to the ejs
  const templateVars = {
    id: jokeObj.id,
    question: jokeObj.question,
    answer: jokeObj.answer,
  };

  res.render('joke_show', templateVars);
});

// create the update route => when the user clicks on update from the show page
// technically this should be put but the browser does not allow put or delete. Just
// get or post
app.post('/jokes/:id', (req, res) => {
  // extract the id from the path of the url
  const jokeId = req.params.id;

  // extract the user input from the form (post data)
  // req.body

  const { question, answer } = req.body;

  // update our db for that joke

  jsJokesDb[jokeId] = {
    id: jokeId,
    question: question,
    answer: answer,
  };

  res.redirect(`/jokes/${jokeId}`);
});

app.post('/jokes/:id/delete', (req, res) => {
  const jokeId = req.params.id;

  // delete that joke from the db?
  delete jsJokesDb[jokeId];

  // redirect to the list of jokes
  res.redirect('/jokes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
