const express = require('express');

// middleware making a log at the terminal
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

// CRUD Operations on jokes

// Display all the jokes in our db
// READ
app.get('/jokes', (req, res) => {


  const templateVars = {quotesList: jsJokesDb};

  // res.send(); => send a response (NodeJS)
  res.render('jokes_list', templateVars);

});

// Create a new joke

// READ => display the new form
app.get('/jokes/new', (req, res) => {
  

  res.render('new_joke');

});

// CREATE => add the joke into our db
app.post('/jokes', (req, res) => {

  // extract the information that was Submitted with the form
  const question = req.body.question;
  const answer = req.body.answer;

  const newKey = Math.random().toString(36).substring(2,8);

  // Add it to the database (jsJokesDb)
  jsJokesDb[newKey] = {
    id: newKey,
    question: question,
    answer: answer
  }

  // redirect
  // ask the browser to perform get /jokes
  res.redirect('/jokes');


})


// Update an existing joke

// Delete a joke
// DELETE operation

// READ => display the update form
app.get('/jokes/:id', (req, res) => {
  
  const jokeId = req.params.id;

  if (!jsJokesDb[jokeId]) {

    res.send("sorry that joke does not exist")
    return;
  }
  
  const templateVars = {jokeId: jokeId, question: jsJokesDb[jokeId].question, answer: jsJokesDb[jokeId].answer};
  
  res.render('joke_show', templateVars);
});

// UPDATE => update the info in the db
app.post('/jokes/:id', (req, res) => {

  // extract the id
  const jokeId = req.params.id;

  // extract the question and anwer
  const question = req.body.question;
  const answer = req.body.answer;

  // update the db

  jsJokesDb[jokeId].question = question;
  jsJokesDb[jokeId].answer = answer;


  // redirect
  res.redirect('/jokes');

});


// DELETE a Joke

app.post('/jokes/:id/delete', (req, res) =>{

  // extract the id

  const jokeId = req.params.id;

  // delete this joke from db
  delete jsJokesDb[jokeId];

  res.redirect('/jokes')

})

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
