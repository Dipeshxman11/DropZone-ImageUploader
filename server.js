const express = require('express');
const session = require('express-session');
const path = require("path")
const passport = require('passport');
const routes = require('./routes/user')
const configurePassport = require('./passport-config');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js
configurePassport(passport);

app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

