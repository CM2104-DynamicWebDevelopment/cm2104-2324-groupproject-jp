const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080; // Change port to 8080

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key', // Change this to a secret key
  resave: false,
  saveUninitialized: true
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user }); // Passing user data to EJS template
});

app.get('/myaccount', (req, res) => {
  // Check if the user is logged in
  if (req.session.user) {
    res.render('myaccount');
  } else {
    res.redirect('/');
  }
});

app.get('/groups', (req, res) => {
  // Check if the user is logged in
  if (req.session.user) {
    res.render('groups');
  } else {
    res.redirect('/');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Assuming a simple authentication mechanism
  if (username === 'admin' && password === 'password') {
    req.session.user = username; // Storing user data in session
    res.redirect('/');
  } else {
    res.send('Invalid username or password');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
