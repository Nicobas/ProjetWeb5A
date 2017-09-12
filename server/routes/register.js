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

    router.route('/verifyEmail/:email')
        .get(function (req, res, next) {
            User.findOne({email: req.params.email}, function (err, o) {
                if (err) {
                    err.httpRes = res;
                    throw err;
                }
                res.status(200).json({isAvailable: !o});
            });
        });

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

    var verifyPassword = function (value, errors, done) {
        if (!value || !value.first)
            errors.push({field: "password.first", message: "Password is required"});

        if (value && value.first && !(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,64}$/).test(value.first))
            errors.push({field: "password", message: 'Invalid password format'});

        if (value && !value.second)
            errors.push({field: "password.second", message: "Confirmation password is required"});
        else if (value && value.first !== value.second)
            errors.push({field: "password.second", message: 'Passwords did not match'});

        done();
    };
};
