

/**
 * @Author: John Isaacs <john>
 * @Date:   01-Mar-19
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 03-Mar-2024
 */

// Import necessary modules
const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser
const { MongoClient } = require('mongodb-legacy'); // npm install mongodb-legacy

// Define MongoDB connection details
const url = 'mongodb://127.0.0.1:27017'; // URL of the MongoDB database
const dbname = 'profiles'; // Database name
const client = new MongoClient(url); // Create the MongoDB client

// Create Express app
const app = express();

// Set up session middleware
app.use(session({ secret: 'example' }));

// Set up body-parser middleware to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Variable to hold the MongoDB database connection
let db;

// Connect to MongoDB and start the server
connectDB();
async function connectDB() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(dbname); // Set the 'db' variable as the MongoDB database
        app.listen(8080); // Start the Express server
        console.log('Listening for connections on port 8080');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// ********** GET ROUTES - Deal with displaying pages **********

// Root route - handle login and rendering of index page
app.get('/', function (req, res) {
    // If user is already logged in, redirect to the main page
    if (req.session.loggedin) {
        res.redirect('/myaccount');
        return;
    }
  
    // Render the index page (which includes the login form)
    res.render('pages/index');
});

// Render the myaccount page
app.get('/myaccount', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }

    var uname = req.query.username;

    db.collection('people').findOne({
        "login.username": uname
    }, function (err, result) {
        if (err) throw err;

        res.render('pages/myaccount', {
            user: result
        });
    });
});

// Adduser route
app.get('/adduser', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.render('pages/adduser');
});

// Login route
app.post('/login', function (req, res) {
    var uname = req.body.username;
    var pword = req.body.password;

    db.collection('people').findOne({
        "login.username": uname
    }, function (err, result) {
        if (err) throw err;

        if (!result || result.login.password != pword) {
            res.redirect('/');
            return;
        }

        req.session.loggedin = true;
        req.session.currentuser = uname;
        res.redirect('/myaccount');
    });
});

// ********** POST ROUTES - Deal with processing data from forms **********

// The delete route deals with user deletion based on entering a username
app.post('/delete', function (req, res) {
    // Check if user is logged in
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    // Get the username from the form
    var uname = req.body.username;

    // Delete the document based on the username
    db.collection('people').deleteOne({
        "login.username": uname
    }, function (err, result) {
        if (err) throw err;

        // Redirect to the index page when deletion is complete
        res.redirect('/');
    });
});

// The adduser route deals with adding a new user
app.post('/adduser', function (req, res) {
    // Check if user is logged in
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    // Create the data object from the form inputs
    var datatostore = {
        "gender": req.body.gender,
        "name": {
            "title": req.body.title,
            "first": req.body.first,
            "last": req.body.last
        },
        "location": {
            "street": req.body.street,
            "city": req.body.city,
            "state": req.body.state,
            "postcode": req.body.postcode
        },
        "email": req.body.email,
        "login": {
            "username": req.body.username,
            "password": req.body.password
        },
        "dob": req.body.dob,
        "registered": new Date(), // using new Date() to get current date object
        "picture": {
            "large": req.body.large,
            "medium": req.body.medium,
            "thumbnail": req.body.thumbnail
        },
        "nat": req.body.nat
    };

    // Save the data object to the database
    db.collection('people').save(datatostore, function (err, result) {
        if (err) throw err;
        console.log('Saved to database');
        // Redirect to the index page when saving is complete
        res.redirect('/');
    });
});
