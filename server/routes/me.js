var User = require('../models/User');
var Conversation = require('../models/Conversation');
var AuthenticateToken = require('../models/AuthenticateToken');

var generator = require('../services/generator');
var database = require('../services/database');
var auth = require('../services/auth');

var nconf = require('nconf');

// export class User {
//     email: string;
//     password: string;
//     pseudo: string;
//     picture: string;
//     phrase: string;
//     contacts: Contact[];
// }
// export class Contact {
//     //email: string;
//     pseudo: string;
//     //picture: string;
//     //phrase: string;
// }


module.exports = function (router) {
    'use strict';

    //route pour modifier les donner du profil
    router.route('/')
        .post(function (req, res, next) {
            auth(req, res, next)
        }, function (req, res, next) {
            var errors = [];
            async.waterfall(
                [
                    function (done) {
                        if (req.param.email) {
                            verifyEmail(req.body.email, errors, res, done);
                        }
                    },
                    function (done) {
                        if (req.param.pseudo) {
                            if (req.param.pseudo.length > 3 && req.param.pseudo.length < 50) {
                                req.me.pseudo = req.param.pseudo;
                            } else {
                                errors.push({field: "pseudo", message: "Invalid pseudo."});
                            }
                        }
                    },
                    // function (done) {
                    //     if (req.param.picture) {
                    //
                    //     }
                    // },
                    function (done) {
                        if (req.param.phrase) {
                            if (req.param.phrase.length < 200) {
                                req.me.phrase = req.param.phrase
                            } else {
                                errors.push({field: "pseudo", message: "Invalid phrase."});
                            }
                        }
                    },
                ],

                function (err) {
                    if (err) {
                        err.httpRes = res;
                        throw err;
                    }

                    if (errors.length > 0) {
                        res.status(400).json({errors: errors});
                    }
                    else {

                        // Attempt to save the user
                        newUser.save(function (err) {
                            if (err) {
                                err.httpRes = res;
                                throw err;
                            }

                            var userRes = {
                                pseudo: req.me.pseudo,
                                email: req.me.email,
                                phrase: req.me.phrase,
                                picture: req.me.picture
                            };

                            res.status(201).json(userRes);
                        });
                    }
                }
            );
        });

    //get all information from user.
    router.route('/')
        .get(function (req, res, next) {
            auth(req, res, next)
        }, function (req, res, next) {
            //get all the info from mongodb
            //find https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find
        });

    //get all the info from the user
    router.route('/conversations')
        .get(function (req, res, next) {
            if (!req.body.token)
                res.status(400).json({message: 'Token required'});
            else {

            }
        });

    //create a conversation from an authenticated user with another.
    router.route('/conversations')
        .post(
         //  function (req, res, next) {
         //    auth(req, res, next)
         // },
          function (req, res, next) {
            var list = [req.body.EmailSender, req.body.EmailReciever]
            var sender = req.body.EmailSender;
            var reciever = req.body.EmailReciever;
            var msg = "test";
            var conv = new Conversation (
              {
                participant: {_user: sender},
                messages: {_author: sender, content: msg}
              });


            //   participant : { _user: [sender,reciever] },
            //   messages : { _author:sender,content:msg}
            //
            // });


            database.save(conv,function (err) {
                if (err) {
                    err.httpRes = res;
                    throw err;
                } else {
                    console.log('new conv.')
                }
            })
        });




    /**
     * TOOLS
     */
    var verifyEmail = function (value, errors, res, done) {
        if (!value) {
            errors.push({field: "email", message: "Email is required"});
            done();
        }
        else {
            if (value && !(/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/).test(value)) {
                errors.push({field: "email", message: "Invalid email format"});
                done();
            }
            else {
                User.count({email: value}, function (err, c) {
                    if (err) {
                        err.httpRes = res;
                        throw err;
                    }

                    if (c !== 0)
                        errors.push({field: "email", message: "Email is already used"});
                    done();
                });
            }
        }
    };
}
