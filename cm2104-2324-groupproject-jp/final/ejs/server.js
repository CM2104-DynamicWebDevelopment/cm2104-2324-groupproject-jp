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
    // Render myaccount page with user data and watchlist
    res.render('pages/myaccount', { user: req.session.user});
});

// Route to render the group.ejs page
app.get('/groups', (req, res) => {
    // Redirect to login if not logged in
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    // Render groups page with user data and watchlist
    res.render('pages/groups', { user: req.session.user, watchlist: req.session.user.watchlist });
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
            
            // Retrieve watchlist data for the user and store it in the session
            db.collection('people').findOne({ _id: result._id }, { watchlist: 1 }, (err, watchlistResult) => {
                if (err) throw err;
                req.session.user.watchlist = watchlistResult.watchlist;
                res.redirect('/myaccount'); // Redirect to myaccount if login successful
            });
        } else {
            res.redirect('/');
        }
    });
});

// Route to handle adding a new user
app.post('/adduser', (req, res) => {
    const defaultProfilePic = 'img/user1.jpg';
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
            "thumbnail": defaultProfilePic // Using default picture if no thumbnail provided
        },
        "watchlist": { // Adding watchlist field
            "movieIds": ["105", "165"] // Initial movie IDs to add upon signup
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
        res.redirect('/myaccount'); // Redirect if signup successful
    });
});


//logour route cause the page to Logout.
//it sets our session.loggedin to false and then redirects the user to the login
app.post('/logout', function (req, res) {
  // Set the loggedin session variable to false
  req.session.loggedin = false;
  // Destroy the session
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      // Redirect the user to the login page
      res.redirect('/');
    }
  });
});



app.post('/addwatchlist', (req, res) => {
    // Check if the user is logged in
    if (!req.session.loggedin) {
        res.redirect('/'); // Redirect to login 
        return;
    }

    const movieId = req.body.movieId;

    if (!movieId) {
        res.status(400).send('Movie ID is required.');
        return;
    }

    const watchlist = req.session.user.watchlist;
    const userEmail = req.session.user.email; 

    if (watchlist.movieIds.includes(movieId)) {
        res.status(400).send('Movie is already in the watchlist.');
        return;
    }

    watchlist.movieIds.push(movieId);

    // Update user session
    req.session.user.watchlist = watchlist;

    console.log(userEmail); // Logging user email

    // Update the database
    db.collection('people').updateOne(
        { email: userEmail },
        { $set: { watchlist: req.session.user.watchlist }}, 
        function(err, result){
            if (err) {
                console.error("error updating watchlist:", err);
                console.log(result)
                return;
            }
            console.log("Set movie id " + movieId + " to user " + userEmail);
            console.log(result)
            res.redirect('/');
        }
    );
});





// retrieve watchlist movie IDs
app.get('/getWatchlistMovieIds', (req, res) => {
    // get watchlist movie ids from the session
    const watchlistMovieIds = req.session.user.watchlist.movieIds;

    // send the movie ids as the response
    res.json({ watchlistMovieIds });
});


app.post('/removeWatchlist', (req, res) => {
    // Check if the user is logged in
    if (!req.session.loggedin) {
        res.redirect('/'); // Redirect to login 
        return;
    }

    const movieId = req.body.movieId;

    if (!movieId) {
        res.status(400).send('Movie ID is required.');
        return;
    }

    const watchlist = req.session.user.watchlist;
    const userEmail = req.session.user.email; 

    console.log(userEmail); // Logging user email

    // Update the database
    db.collection('people').updateOne(
        { email: userEmail },
        { $pull: { watchlist: movieId }}, 
        function(err, result){
            if (err) {
                console.error("error updating watchlist:", err);
                console.log(result)
                return;
            }
                // Update user session
            req.session.user.watchlist = watchlist;
            console.log("removed movie id " + movieId + " from user " + userEmail);
            console.log(result)
            res.redirect('/');
        }
    );
});