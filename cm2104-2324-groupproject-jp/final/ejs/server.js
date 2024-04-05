
//code to link to mongo module
const MongoClient = require('mongodb-legacy').MongoClient; //npm install mongodb-legacy
const url = 'mongodb://127.0.0.1:27017'; // the url of our database
const client = new MongoClient(url); // create the mongo client
const dbname = 'profiles'; // the data base we want to access

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

//this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'cinemind_small_logo.png')));



//code to tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
  extended: true
}))

// set the view engine to ejs
app.set('view engine', 'ejs');

//variable to hold our Database
var db;

//run the connect method.
connectDB();
//this is our connection to the mongo db, ts sets the variable db as our database
async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    //everything is good lets start
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}



//this is our login route, all it does is render the login.ejs page.
// Route to render the index.ejs page
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Route to render the myaccount.ejs page
app.get('/myaccount', (req, res) => {
  res.render('myaccount', { user: req.session.user });
});

// Route to render the group.ejs page
app.get('/groups', (req, res) => {
  res.render('groups', { user: req.session.user });
});




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
    })
  });

});

app.post('/dologin', function (req, res) {
  console.log(JSON.stringify(req.body))
  var uname = req.body.username;
  var pword = req.body.password;



  db.collection('people').findOne({
    "login.username": uname
  }, function (err, result) {
    if (err) throw err;


    if (!result) {
      res.redirect('/');
      return
    }



    if (result.login.password == pword) {

      req.session.loggedin = true;
      req.session.currentuser = uname;
      res.redirect('/myaccount')
    } else {
      res.redirect('/')
    }
  });
});



app.post('/adduser', function (req, res) {
  //check we are logged in
  if (!req.session.loggedin) {
    res.redirect('/login');
    return;
  }

  //we create the data string from the form components that have been passed in

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
    "registered": Date(),
    "picture": {
      "large": req.body.large,
      "medium": req.body.medium,
      "thumbnail": req.body.thumbnail
    },
    "nat": req.body.nat
  }


  //once created we just run the data string against the database and all our new data will be saved/
  db.collection('people').save(datatostore, function (err, result) {
    if (err) throw err;
    console.log('saved to database')
    //when complete redirect to the index
    res.redirect('/')
  })
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
