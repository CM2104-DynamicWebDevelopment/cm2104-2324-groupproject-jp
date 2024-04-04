const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

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

// Set the path to serve static files (like CSS, images, or your EJS views)
app.use(express.static(path.join(__dirname, 'cm2104-2324-groupproject-jp/final/ejs/views')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user }); // Passing user data to EJS template
});

// Add more routes as needed...

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
