const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3005;

// creating an Express app
const app = express();

app.use(cookieParser());

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
};

const usersDb = {
  eb849b1f: {
    id: 'eb849b1f',
    name: 'Kent Cook',
    email: 'really.kent.cook@kitchen.com',
    password: 'cookinglessons',
  },
  '1dc937ec': {
    id: '1dc937ec',
    name: 'Phil A. Mignon',
    email: 'good.philamignon@steak.com',
    password: 'meatlover',
  },
};

const createNewQuote = content => {
  const quoteId = uuid().substr(0, 8);

  // {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }

  // creating the new quote object
  const newQuote = {
    id: quoteId,
    quote: content,
  };

  // Add the newQuote object to movieQuotesDb

  movieQuotesDb[quoteId] = newQuote;

  return quoteId;
};

const updateQuote = (quoteId, content) => {
  // d9424e04: {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }

  // updating the quote key in the quote object
  movieQuotesDb[quoteId].quote = content;

  return true;
};

const addNewUser = (name, email, password) => {
  // Generate a random id
  const userId = uuid().substr(0, 8);

  // Create a new user object
  //  {
  //    id: 'eb849b1f',
  //      name: 'Kent Cook',
  //        email: 'really.kent.cook@kitchen.com',
  //          password: 'cookinglessons',
  //  }

  const newUserObj = {
    id: userId,
    name,
    email,
    password,
  };

  // Add the user Object into the usersDb

  usersDb[userId] = newUserObj;

  // return the id of the user

  return userId;
};

const findUserByEmail = email => {
  // const user = Object.values(usersDb).find(userObj => userObj.email === email)
  //  return user;

  // loop through the usersDb object
  for (let userId in usersDb) {
    // compare the emails, if they match return the user obj
    if (usersDb[userId].email === email) {
      return usersDb[userId];
    }
  }

  // after the loop, return false
  return false;
};

const authenticateUser = (email, password) => {
  // retrieve the user with that email
  const user = findUserByEmail(email);

  // if we got a user back and the passwords match then return the userObj
  if (user && user.password === password) {
    // user is authenticated
    return user;
  } else {
    // Otherwise return false
    return false;
  }
};

// Authentication

// Display the register form
app.get('/register', (req, res) => {
  const templateVars = { currentUser: null };
  res.render('register', templateVars);
});

// Get the info from the register form
app.post('/register', (req, res) => {
  // extract the info from the form
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // check if the user is not already in the database

  const user = findUserByEmail(email);

  // if not in the db, it'ok to add the user to the db

  if (!user) {
    const userId = addNewUser(name, email, password);
    // setCookie with the user id
    res.cookie('user_id', userId);

    // redirect to /quotes
    res.redirect('/quotes');
  } else {
    res.status(403).send('Sorry, the user is already registered');
  }
});

// Display the login form
app.get('/login', (req, res) => {
  const templateVars = { currentUser: null };
  res.render('login', templateVars);
});

// this end point is for checking the content of usersDb
// remove when cleaning up the code
app.get('/users', (req, res) => {
  res.json(usersDb);
});

// Authenticate the user
app.post('/login', (req, res) => {
  // extract the info from the form
  const email = req.body.email;
  const password = req.body.password;

  // Authenticate the user
  const user = authenticateUser(email, password);

  // if authenticated, set cookie with its user id and redirect
  if (user) {
    res.cookie('user_id', user.id);
    res.redirect('/quotes');
  } else {
    // otherwise we send an error message
    res.status(401).send('Wrong credentials!');
  }
});

app.post('/logout', (req, res) => {
  // clear the cookies
  res.cookie('user_id', null);

  // redirect to /quotes
  res.redirect('/quotes');
});

// CRUD operations

// List all the quotes
// READ
// GET /quotes

app.get('/quotes', (req, res) => {
  const quoteList = Object.values(movieQuotesDb);

  // get the current user
  // read the user id value from the cookies

  const userId = req.cookies['user_id'];

  const loggedInUser = usersDb[userId];

  const templateVars = { quotesArr: quoteList, currentUser: loggedInUser };

  res.render('quotes', templateVars);

  // res.json(movieQuotesDb);
});

// Display the add quote form
// READ
// GET /quotes/new

app.get('/quotes/new', (req, res) => {
  // get the current user
  // read the user id value from the cookies

  const userId = req.cookies['user_id'];

  const loggedInUser = usersDb[userId];

  const templateVars = { currentUser: loggedInUser };

  res.render('new_quote', templateVars);
});

// Add a new quote
// CREATE
// POST /quotes

app.post('/quotes', (req, res) => {
  // extract the quote content from the form.
  // content of the form is contained in an object call req.body
  // req.body is given by the bodyParser middleware
  const quoteStr = req.body.quoteContent;

  // Add a new quote in movieQuotesDb

  createNewQuote(quoteStr);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// Edit a quote

// Display the form
// GET /quotes/:id
app.get('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;
  // get the current user
  // read the user id value from the cookies

  const userId = req.cookies['user_id'];

  const loggedInUser = usersDb[userId];
  const templateVars = {
    quoteObj: movieQuotesDb[quoteId],
    currentUser: loggedInUser,
  };

  // render the show page
  res.render('quote_show', templateVars);
});

// Update the quote in the movieQuotesDb
// PUT /quotes/:id

app.post('/quotes/:id', (req, res) => {
  // Extract the  id from the url
  const quoteId = req.params.id;

  // Extract the content from the form
  const quoteStr = req.body.quoteContent;

  // Update the quote in movieQuotesDb

  updateQuote(quoteId, quoteStr);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// DELETE

app.post('/quotes/:id/delete', (req, res) => {
  const quoteId = req.params.id;

  delete movieQuotesDb[quoteId];

  res.redirect('/quotes');
});

// Delete the quote

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
