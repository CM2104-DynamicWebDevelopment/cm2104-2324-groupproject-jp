// Import required modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
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

// Connect to MongoDB
const MongoClient = require('mongodb-legacy').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'profiles';

let db;

// Connect to MongoDB and start server
async function connectDB() {
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

connectDB();

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'cinemind_small_logo.png')));

// Route to render the index.ejs page
app.get('/', (req, res) => {
  // Render index page with user data if logged in, otherwise render with null user
  res.render('pages/index', { user: req.session.loggedin ? req.session.user : null, req: req });
});


// Route to render the myaccount.ejs page
app.get('/myaccount', (req, res) => {
  // Redirect to login if not logged in
  if (!req.session.loggedin) {
      res.redirect('/');
      return;
  }

  const userId = req.session.userId;

  // Fetch the user's watchlist from the database
  db.collection('people').findOne({ _id: userId }, (err, user) => {
      if (err) {
          console.error('Error fetching user data:', err);
          return res.status(500).send('Error fetching user data');
      }

      if (!user) {
          return res.status(404).send('User not found');
      }

      // Pass the user data and watchlist to the EJS template
      res.render('pages/myaccount', { user: req.session.user, watchlist: user.watchlist });
  });
});


// Route to render the group.ejs page
app.get('/groups', (req, res) => {
    // Redirect to login if not logged in
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.render('pages/groups', { user: req.session.user });
});

// Route to handle login form submission
app.post('/dologin', (req, res) => {
    const uname = req.body.username;
    const pword = req.body.password;

    db.collection('people').findOne({ "login.username": uname }, (err, result) => {
        if (err) throw err;

        if (!result) {
            res.redirect('/');
            return;
        }

        if (result.login.password == pword) {
            req.session.loggedin = true;
            req.session.currentuser = uname;
            req.session.userId = result._id; // Set userId in session
            req.session.user = result; // Store user data in session
            res.redirect('/myaccount'); // Redirect to myaccount if login successful
        } else {
            res.redirect('/');
        }
    });
});

// Route to handle adding a new user
app.post('/adduser', (req, res) => {
    const datatostore = {
        "name": {
            "first": req.body.first
        },
        "email": req.body.email,
        "login": {
            "username": req.body.username,
            "password": req.body.password
        },
        "picture": { // Nested structure for profile picture
            "thumbnail": req.body.thumbnail || defaultProfilePic // Using default picture if no thumbnail provided
        }
    };

    db.collection('people').insertOne(datatostore, (err, result) => {
        if (err) {
            console.error('Error saving to database:', err);
            res.status(500).send('Error saving to database');
            return;
        }
        console.log('User saved to database');
        // Set userId in session after user creation
        req.session.userId = result.insertedId;
        res.send('User added successfully');
    });
});

// Route to handle adding a movie to the user's watchlist
app.post('/addwatchlist', (req, res) => {
    const userId = req.session.userId; // Retrieve userId from session
    const movieId = req.body.movieId;

    // Check if userId and movieId are present
    if (!userId || !movieId) {
        res.status(400).send('User ID and/or movie ID missing');
        return;
    }

    // Find the user document in the database and update the watchlist
    db.collection('people').updateOne(
        { _id: userId },
        { $addToSet: { watchlist: movieId } },
        (err, result) => {
            if (err) {
                console.error('Error adding movie to watchlist:', err);
                res.status(500).send('Error adding movie to watchlist');
                return;
            }
            console.log('Movie added to watchlist successfully');
            console.log('Movie ID: ' + movieId);
            res.sendStatus(200);
        }
    );
});

// Assuming you have middleware set up to handle sessions
app.get('/watchlist', function(req, res) {
  const userId = req.session.userId;

  // Assuming your user's watchlist is stored in the user document in the database
  // Fetch the user document based on the userId
  db.collection('people').findOne({ _id: userId }, (err, user) => {
      if (err) {
          console.error('Error fetching user data:', err);
          return res.status(500).send('Error fetching user data');
      }

      if (!user) {
          return res.status(404).send('User not found');
      }

      // Assuming user.watchlist is an array of movie IDs
      const watchlist = user.watchlist || []; // Initialize watchlist as an empty array if it doesn't exist

      // Pass the watchlist data to the EJS template
      res.render('watchlist', { watchlist: watchlist });
  });
});