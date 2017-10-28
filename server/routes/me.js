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
          function (req, res, next) {
            auth(req, res, next, 'conversations')
         },
          function (req, res, next) {
            if (!req.body.userId) {
              res.status(400).json({})
            }
            else {
              User.findOne({_id: req.body.userId},
                '_id conversations',
                function (err, user) {

                  var conv = new Conversation({
                    participants: [
                      {
                        _user: req.me
                      },
                      {
                        _user: user
                      }
                    ]
                  });

                  // save it in the user
                  req.me.conversations.push({
                    _conversation: conv,
                    _partner: user
                  });

                  user.conversations.push({
                    _conversation: conv,
                    _partner: req.me
                  });

                  // save multiple files
                  database.saveRecursive([conv, req.me, user],function (err) {
                    if (err) {
                      err.httpRes = res;
                      throw err;
                    } else {
                      console.log('conv', conv)
                      res.status(201).json({id: conv._id})
                    }
                  })
                });
            }
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
