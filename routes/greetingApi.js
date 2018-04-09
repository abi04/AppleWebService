var express = require('express');
var ensureLogin = require('connect-ensure-login');
var router = express.Router();
var http = require('http');
var config = require('../config');
var request = require('request');
var axios = require('axios');

// ensureLogin.ensureLoggedIn used as middleware to check for authenticated request.
router.get('/greet', ensureLogin.ensureLoggedIn('/'), function (req, res, next) {


    var header = {
        'authorization': req.session.token
    };

    // Raise error on response code other than 200
    var instance = axios.create({
        validateStatus: function (status) {
            return status == 200;
        }
    });

    //Fire request to greeting API to validate token
    instance.get(config.greetingApiUrl, {
        headers: header
    })
        .then(function (response) {
            res.render('greeting', { user: response.data });
        })
        .catch(function (error) {

            next(error);

        });
})

module.exports = router;
