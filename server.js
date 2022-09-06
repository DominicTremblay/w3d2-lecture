const express = require('express');
const { get } = require('express/lib/response');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

// creating an Express app
const app = express();

// morgan middleware allows to log the request in the terminal
app.use(morgan('short')); // <= this is a middleware because of app.use

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

// helper route
app.get('/jokes.json', (req, res) => {
  // display the content of the db
  res.json(jsJokesDb);
});

// C[R]UD => Read
// read the list of quotes
app.get('/jokes', (req, res) => {
  // access the db to get the data
  const templateVars = { jokesDb: jsJokesDb };

  // sending back the response
  res.render('joke_list', templateVars);
});

// create a new quote => [C]RUD

// get and post
// get => display the add new joke form
app.get('/jokes/new', (req, res) => {
  res.render('new_joke');
});

// post => actually enter the new joke in the db

app.post('/jokes', (req, res) => {
  // Get the input values from the form
  const { question, answer } = req.body;
  // const question = req.body.question;
  // const answer = req.body.answer

  // generate a random id
  const jokeId = Math.random().toString(36).substring(2, 8);

  // add these values to the database

  // {
  //   id: 'd9424e04',
  //   question: 'Why was the JavaScript developer sad?',
  //   answer: "Because they didn't Node how to Express himself",
  // }

  jsJokesDb[jokeId] = {
    id: jokeId,
    question,
    answer,
  };

  // response (redirect)
  res.redirect('/jokes');
});

// update a joke
// GET => display the update form

app.get('/jokes/:id', (req, res) => {
  // extract the id from the request => req.params

  const jokeId = req.params.id;
  const templateVar = { joke: jsJokesDb[jokeId] };

  console.log({ jokeId });
  console.log(templateVar);

  res.render('joke_show', templateVar);
});

// PUT => updating the data in the db

app.post('/jokes/:id', (req, res) => {
  // extract the id from the path

  const { id } = req.params;

  // extract the content from the form
  const { question, answer } = req.body;

  console.log('id', id, 'question', question, 'answer', answer);

  // update the database (object)
  jsJokesDb[id] = {
    id,
    question,
    answer,
  };

  // jsJokesDb[id].question = question;
  // jsJokesDb[id].answer = answer;

  // redirect to /jokes
  res.redirect('/jokes');
});



app.post('/jokes/:id/delete', (req, res) => {
  // extract the id of the joke
  const { id } = req.params;
  // delete from the db
  delete jsJokesDb[id];
  // redirect to /jokes
  res.redirect('/jokes');
});

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
