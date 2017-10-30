var User = require('../models/User');
var Conversation = require('../models/Conversation');
var AuthenticateToken = require('../models/AuthenticateToken');

var generator = require('../services/generator');
var database = require('../services/database');
var auth = require('../services/auth');
var async = require('async');

var nconf = require('nconf');

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
            if (req.body.email) {
              verifyEmail(req.body.email, errors, res, function () {
                req.me.email = req.body.email;
                done();
              });
            }
          },
          function (done) {
            if (req.body.pseudo) {
              if (req.body.pseudo.length > 3 && req.body.pseudo.length < 50) {
                req.me.pseudo = req.body.pseudo;
              } else {
                errors.push({field: "pseudo", message: "Invalid pseudo."});
              }
            }

            done();
          },
          function (done) {
            if (req.body.phrase) {
              if (req.body.phrase.length < 200) {
                req.me.phrase = req.body.phrase
              } else {
                errors.push({field: "pseudo", message: "Invalid phrase."});
              }
            }

            done();
          }
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
            req.me.save(function (err) {
              if (err) {
                err.httpRes = res;
                throw err;
              }

              var userRes = {
                pseudo: req.me.pseudo,
                email: req.me.email,
                phrase: req.me.phrase
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
      auth(req, res, next, 'email phrase')
    }, function (req, res, next) {
      User.findById(req.me._id, 'conversations._partner conversations._conversation')
        .populate('conversations._partner', '_id pseudo')
        .exec(function (err, user) {
          var conversations = [];
          user.conversations.forEach((function (item) {
            conversations.push({
              id: item._conversation,
              partner: {
                id: item._partner._id,
                pseudo: item._partner.pseudo
              }
            })
          }));
          req.conversations = conversations;
          next();
        });
    }, function (req, res, next) {
      res.status(200).json({
        id: req.me._id,
        pseudo: req.me.pseudo,
        email: req.me.email,
        phrase: req.me.phrase,
        conversations: req.conversations
      })
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
              database.saveRecursive([conv, req.me, user], function (err) {
                if (err) {
                  err.httpRes = res;
                  throw err;
                }

                res.status(201).json({id: conv._id})

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
