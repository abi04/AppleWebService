var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var User = require('../models/user');
var userController = require('../controller/userController');
var jwt = require('jsonwebtoken');
var config = require('../config');

//Get form to register new users
router.get('/register', function (req, res) {
  res.render('register');
});

//Register new users
router.post('/register', userController.addUser);

//Determines, which data of the user object should be stored in the session.
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

//Used to retrieve the whole user object saved in session
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//Passport middleware to authenticate request
passport.use('local-signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, username, password, done) {
  User.findOne({ 'username': username }, function (err, user) {
    if (err)
      return done(err);
    if (!user) {
      console.log('User Not Found with username ');
      
      return done(null, false, req.flash('message', 'Incorrect username.'));
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log('Incorrect Password ');
      return done(null, false, req.flash('message', 'Incorrect Password.'));
    }

    return done(null, user);
  });
}));

router.post('/login',
  passport.authenticate('local-signin', { failureRedirect: '/' }),
  function (req, res) {

    //Create token payload
    const payload = {
      username: req.user.name
    };

    //Create JWT token
    var token = jwt.sign(payload, config.secretKey, {
      expiresIn: config.expirationTime
    });

    let bearerTokenValue = `Bearer ${token}`;

    req.session.token = bearerTokenValue;

    res.redirect('/greet');
  });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
