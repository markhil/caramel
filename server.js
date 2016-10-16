/* Setup Dependencies
==========================================*/
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

// Middleware
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');


/* Configuration
==========================================*/
mongoose.connect(configDB.url);

require('./config/passport')(passport);

// Set up application
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

// Set view engine
app.set('view engine', 'ejs');


// required for passport
app.use(session({secret: 'caramelslices'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Routes
==========================================*/
require('./app/routes.js')(app, passport);


/* Launch
==========================================*/
app.listen(port);
console.log('App listening on ' + port);

