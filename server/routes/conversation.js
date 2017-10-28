var async = require('async');
var nconf = require('nconf');

var User = require('../models/User');
var Conversation = require('../models/Conversation');

module.exports = function (router) {
  'use strict';

  router.route('/')
    .post(function (req, res, next) {
      var errors = [];

      async.waterfall(
        [
          function (done) {
            verifyEmail(req.body.email, errors, res, done);
          },
          function (done) {
            verifyPassword(req.body.password, errors, done);
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

            var newUser = new User({
              pseudo: req.body.pseudo,
              email: req.body.email,
              password_hash: req.body.password.first,
              status: 'Online',
              creation_ip: req.connection.remoteAddress
            });

            // Attempt to save the user
            newUser.save(function (err) {
              if (err) {
                err.httpRes = res;
                throw err;
              }

              var userRes = {
                id: newUser._id,
                pseudo: newUser.pseudo,
                email: newUser.email,
                status: newUser.status
              };

              res.status(201).json(userRes);
            });
          }
        }
      );
    });


  //get all the info from the user
  router.route(':id')
    .get(function (req, res, next) {
      if (!req.body.token)
        res.status(400).json({message: 'Token required'});
      else {
        Conversation.findOne({id: req.params.id},
          '_id participants messages',
          function (err, o) {
            if (err) {
              err.httpRes = res;
              throw err;
            }
            var currentConv = new Conversation({
              id: req.body.id,
            });
            res.status(201).json(currentConv);
          });
      }
    });

  //create conversation (sends a message to new conversation
  // BODY: message et le destinataire
  router.route(':id')
    .post(function (req,res,next){
      auth(req, res, next)
    }, function (req, res, next) {

      var conv = new Conversation({
        message: [{
          _author: req.me._id,
          content: req.body.message,
          }],
        participant: [
          {user:req.body.receiver},
          {user:req.me._id}]
      });

      // Attempt to save the user
      conv.save(function (err) {
        if (err) {
          err.httpRes = res;
          throw err;
        }

        var convRes = {
          message: [{
            _author: req.me._id,
            content: req.body.message,
          }],
          participant: [
            {user:req.body.receiver},
            {user:req.me._id}]
        };

        res.status(201).json(convRes);
      });
    });

  // delete conversation
  router.route(':id')
    .delete(function (req, res, next) {
      auth(req, res, next)
    }, function (req, res, next) {
      Conversation.remove({
        id: req.body.id
      }),
        function (err) {
          if (err) {
            err.httpRes = res;
            throw err;
          }

          res.status(204).json()
        }
    });
};
