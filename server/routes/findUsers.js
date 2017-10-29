var async = require('async');
var nconf = require('nconf');

var auth = require('../services/auth');

var User = require('../models/User');

module.exports = function (router) {
  'use strict';

  //get all the info from the user
  router.route('/:pseudo')
    .get(function (req, res, next) {
      auth(req, res, next)
    }, function (req, res, next) {
      User.find({pseudo: new RegExp(req.params.pseudo, "i")}, '_id pseudo', function (err, objs) {
        if (err) {
          err.httpRes = res;
          throw err;
        }

        var results = [];

        objs.forEach(function (item) {
          results.push({
            id: item._id,
            pseudo: item.pseudo,
          })
        });

        res.status(200).json(results);
      });
    });
};
