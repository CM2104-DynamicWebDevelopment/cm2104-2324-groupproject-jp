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
    if (req.session.loggedin) {
        // If user is logged in, redirect to myaccount
        res.redirect('/myaccount');
    } else {
        // If not logged in, render index page with login form
        res.render('pages/index', { user: null });
    }
});

// Route to render the myaccount.ejs page
app.get('/myaccount', (req, res) => {
    // Redirect to login if not logged in
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.render('pages/myaccount', { user: req.session.user });
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
            req.session.user = result; // Store user data in session
            res.redirect('/myaccount'); // Redirect to myaccount if login successful
        } else {
            res.redirect('/');
        }
    });
});

// Route to handle user deletion
app.post('/delete', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    const uname = req.body.username;

    db.collection('people').deleteOne({ "login.username": uname }, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Route to handle adding a new user
app.post('/adduser', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }

    const datatostore = {
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
        "registered": Date(),
        "picture": {
            "large": req.body.large,
            "medium": req.body.medium,
            "thumbnail": req.body.thumbnail
        },
        "nat": req.body.nat
    };

    db.collection('people').save(datatostore, (err, result) => {
        if (err) throw err;
        console.log('saved to database');
        res.redirect('/');
    });
});
