const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb-legacy').MongoClient;

const app = express();
const port = process.env.PORT || 8080;

const url = 'mongodb://127.0.0.1:27017';
const dbname = 'profiles';
const client = new MongoClient(url);

app.use(session({ secret: 'example' }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        next();
    }
}

// Connect to MongoDB and start the server
async function startServer() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

startServer();

// Root route
app.get('/', requireLogin, (req, res) => {
    const currentuser = req.session.currentuser;
    client.db(dbname).collection('people').find().toArray((err, result) => {
        if (err) throw err;
        client.db(dbname).collection('people').findOne({ "login.username": currentuser }, (err, userresult) => {
            if (err) throw err;
            res.render('pages/users', { users: result, user: userresult });
        });
    });
});

// Login route
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Profile route
app.get('/profile', requireLogin, (req, res) => {
    const uname = req.query.username;
    client.db(dbname).collection('people').findOne({ "login.username": uname }, (err, result) => {
        if (err) throw err;
        res.render('pages/profile', { user: result });
    });
});

// Add user route
app.get('/adduser', requireLogin, (req, res) => {
    res.render('pages/adduser');
});

// Remove user route
app.get('/remuser', requireLogin, (req, res) => {
    res.render('pages/remuser');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

// Login form submission route
app.post('/dologin', (req, res) => {
    const uname = req.body.username;
    const pword = req.body.password;
    client.db(dbname).collection('people').findOne({ "login.username": uname }, (err, result) => {
        if (err) throw err;
        if (!result) {
            res.redirect('/login');
            return;
        }
        if (result.login.password == pword) {
            req.session.loggedin = true;
            req.session.currentuser = uname;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});

// Delete user route
app.post('/delete', requireLogin, (req, res) => {
    const uname = req.body.username;
    client.db(dbname).collection('people').deleteOne({ "login.username": uname }, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Add user form submission route
app.post('/adduser', requireLogin, (req, res) => {
    const datatostore = {
        "gender": req.body.gender,
        "name": { "title": req.body.title, "first": req.body.first, "last": req.body.last },
        "location": { "street": req.body.street, "city": req.body.city, "state": req.body.state, "postcode": req.body.postcode },
        "email": req.body.email,
        "login": { "username": req.body.username, "password": req.body.password },
        "dob": req.body.dob,
        "registered": Date(),
        "picture": { "large": req.body.large, "medium": req.body.medium, "thumbnail": req.body.thumbnail },
        "nat": req.body.nat
    };
    client.db(dbname).collection('people').save(datatostore, (err, result) => {
        if (err) throw err;
        console.log('Saved to database');
        res.redirect('/');
    });
});
