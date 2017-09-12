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
                        verifyPseudo(req.body.pseudo, errors, res, done);
                    },
                    function (done) {
                        verifyEmail(req.body.email, errors, res, done);
                    },
                    function (done) {
                        verifyPhone(req.body.phone, errors, res, done);
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
                            phone: req.body.phone,
                            password_hash: req.body.password.first,
                            status: nconf.get('environment') === 'dev' ? 'Active' : 'Unconfirmed',
                            confirmation_token: generator.generateToken(),
                            last_notification_request: new Date(),
                            creation_ip: req.connection.remoteAddress
                        });

                        // Attempt to save the user
                        database.save(newUser, function (err) {
                            if (err) {
                                err.httpRes = res;
                                throw err;
                            }

                            mailer.sendMail(newUser.email, "Skeel registration",
                                '<b>Utilisateur créé, confirmez le compte</b><br />User id : ' + newUser.id + '<br />Confirmation token : ' + newUser.confirmation_token,
                                function (err) {
                                    if (err) {
                                        err.httpRes = res;
                                        throw err;
                                    }

                                    var userRes = {
                                        id: newUser._id,
                                        pseudo: newUser.pseudo,
                                        email: newUser.email,
                                        phone: newUser.phone,
                                        status: newUser.status
                                    };

                                    if (nconf.get('environment') === 'dev')
                                        userRes.confirmationToken = newUser.confirmation_token;

                                    res.status(201).json(userRes);
                                });
                        });
                    }
                }
            );
        });

    router.route('/verifyPseudo/:pseudo')
        .get(function (req, res, next) {
            User.findOne({pseudo: req.params.pseudo}, function (err, o) {
                if (err) {
                    err.httpRes = res;
                    throw err;
                }
                res.status(200).json({isAvailable: !o});
            });
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

    var verifyPseudo = function (value, errors, res, done) {
        if (!value) {
            errors.push({field: "pseudo", message: "Pseudo is required"});
            done();
        }
        else {
            if (value && !(/^(?=.*[a-zA-Z])[0-9a-zA-Z_-]{3,32}$/).test(value)) {
                errors.push({field: "pseudo", message: "Invalid pseudo format"});
                done();
            }
            else {
                User.count({pseudo: value}, function (err, c) {
                    if (err) {
                        err.httpRes = res;
                        throw err;
                    }

                    if (c !== 0)
                        errors.push({field: "pseudo", message: "Pseudo is already used"});
                    done();
                });
            }
        }
    };

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
