var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var greeting = require('./routes/greetingApi');
var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config')
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('express-flash')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/', users);
app.use('/',greeting);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Connect to database
mongoose.connect(config.databaseURL);

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development 
  res.locals.message = err.response? err.response.data.message : err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};  
 
  res.status( err.response ? err.response.status :err.status || 500);
  //Redirect unauthorized error to login page
  if(err.response)
  {
    if(err.response.status == 401)
    {
     res.locals.message = err.response.data.message;
     res.render('login');
    }
  }
  // render the error page
  res.render('error');
});

module.exports = app;
