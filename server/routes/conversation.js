var async = require('async');
var nconf = require('nconf');

var User = require('../models/User');

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


};
