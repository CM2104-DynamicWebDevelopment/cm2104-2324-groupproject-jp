/**
 * @Author: John Isaacs <john>
 * @Date:   01-Mar-19
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 03-Mar-2024
 */

const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser
const path = require('path');
const favicon = require('serve-favicon');


const app = express();
const PORT = 8080; // Change port to the desired port number

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'example' }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'cinemind_small_logo.png')));

// Route to render the index.ejs page
app.get('/', (req, res) => {
  res.render('pages/index', { user: req.session.user });
});

// Route to render the myaccount.ejs page
app.get('/myaccount', (req, res) => {
  res.render('myaccount', { user: req.session.user });
});

// Route to render the group.ejs page
app.get('/groups', (req, res) => {
  res.render('groups', { user: req.session.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
