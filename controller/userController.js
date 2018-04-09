var User = require('../models/user');
var bcrypt = require('bcrypt');


module.exports = {

    //Add new user to database
    addUser : function(req,res){
        //Encrypt password before saving to database
        var hashPassword = bcrypt.hashSync(req.body.password,10);
        var result = {
            username : req.body.username,
            password : hashPassword,
            name : req.body.name
        };

        User.create(result).then(function(doc){
            res.redirect('/');
        }).catch(function(err){
            res.redirect('/');
        })
    }



}