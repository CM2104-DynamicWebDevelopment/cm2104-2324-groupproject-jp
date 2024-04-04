const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/account', (req, res) => {
    res.render('account', { title: 'Account' });
});

app.get('/groups', (req, res) => {
    res.render('groups', { title: 'Groups' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
