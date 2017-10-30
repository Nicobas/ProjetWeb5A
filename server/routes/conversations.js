var async = require('async');
var nconf = require('nconf');

var auth = require('../services/auth');

var User = require('../models/User');
var Conversation = require('../models/Conversation');

module.exports = function (router) {
  'use strict';

  //get all the info from the user
  router.route('/:id')
    .get(function (req, res, next) {
      auth(req, res, next)
    }, function (req, res, next) {
      Conversation.findById(req.params.id, '_id messages.content messages._author participants._user')
        .populate('messages._author', '_id pseudo')
        .populate('participants._user', '_id pseudo')
        .exec(function (err, conv) {
          if (err) {
            err.httpRes = res;
            throw err;
          }

          var messages = [];
          var participants = [];

          conv.messages.forEach(function(item) {
            messages.push({
              content: item.content,
              author: {
                id: item._author._id,
                pseudo: item._author.pseudo
              },
              date: item.creation_date
            })
          });

          conv.participants.forEach(function(item) {
            participants.push({
              user: {
                id: item._user._id,
                pseudo: item._user.pseudo
              }
            })
          });

          res.status(201).json({
            id: conv._id,
            participants: participants,
            messages: messages
          });
        });
    });


  router.route('/:id/messages')
    .post(function (req, res, next) {
      auth(req, res, next)
    }, function (req, res, next) {
      Conversation.findById(req.params.id, '_id messages')
        .exec(function (err, conv) {
          if (err) {
            err.httpRes = res;
            throw err;
          }

          conv.messages.push({
            _author: req.me,
            content: req.body.content
          });

          conv.save(function (err) {
            if (err) {
              err.httpRes = res;
              throw err;
            }

            res.status(201).json({
              message: req.body.content
            });
          });
        });
    });

  //... Quand on supprime une conversation, il faut également supprimer les objets conversations dans les utilisateurs concernés
  // // delete conversation
  // router.route(':id')
  //   .delete(function (req, res, next) {
  //     auth(req, res, next)
  //   }, function (req, res, next) {
  //     Conversation.remove({
  //       id: req.body.id
  //     }),
  //       function (err) {
  //         if (err) {
  //           err.httpRes = res;
  //           throw err;
  //         }
  //
  //         res.status(204).json()
  //       }
  //   });
};
