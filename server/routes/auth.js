var User = require('../models/User');
var AuthenticateToken = require('../models/AuthenticateToken');

var generator = require('../services/generator');
var database = require('../services/database');
var auth = require('../services/auth');

var nconf = require('nconf');

module.exports = function (router) {
    'use strict';

    router.route('/login')
        .post(function (req, res, next) {
            if (!req.body.login || !req.body.password)
                res.status(400).json({message: 'Login and password required'});
            else {
                User.findOne({email: req.body.login},
                    '_id password_hash last_authentication',
                    function (err, user) {
                        if (err) {
                            err.httpRes = res;
                            throw err;
                        }

                        if (!user) {
                            res.status(400).json({message: 'Authentication failed'});
                        } else {
                            // Check if password matches
                            user.comparePassword(req.body.password, function (err, isMatch) {
                                if (err) {
                                    err.httpRes = res;
                                    throw err;
                                }
                                if (isMatch && !err) {

                                    var currentDate = new Date();

                                    var refresh_token;
                                    var refresh_token_expiration;

                                    if (req.body.refreshToken === true) {
                                        refresh_token = generator.generateToken();
                                        refresh_token_expiration = new Date().setSeconds(currentDate.getSeconds() + nconf.get('refresh_token_duration'));
                                    }

                                    var newToken = new AuthenticateToken({
                                        authorization_token: generator.generateToken(),
                                        authorization_token_expiration: new Date().setSeconds(currentDate.getSeconds() + nconf.get('authorization_token_duration')),
                                        refresh_token: refresh_token,
                                        refresh_token_expiration: refresh_token_expiration,
                                        _user: user._id,
                                        creation_ip: req.connection.remoteAddress
                                    });

                                    database.save(newToken, function (err) {
                                        if (err) {
                                            err.httpRes = res;
                                            throw err;
                                        }

                                        var last_authentication = user.last_authentication;
                                        user.last_authentication = new Date();

                                        database.save(user, function (err) {
                                            if (err) {
                                                err.httpRes = res;
                                                throw err;
                                            }

                                            res.status(201).json({
                                                userId: newToken._user,
                                                last_authentication: last_authentication,
                                                authorizationToken: newToken.authorization_token,
                                                authorizationTokenExpiration: newToken.authorization_token_expiration,
                                                refreshToken: newToken.refresh_token,
                                                refreshTokenExpiration: newToken.refresh_token_expiration
                                            });
                                        });
                                    });
                                } else {
                                    res.status(400).json({message: 'Authentication failed'});
                                }
                            });
                        }
                    });
            }
        });

    router.route('/refreshToken')
        .post(function (req, res, next) {
            if (!req.body.token)
                res.status(400).json({message: 'Token required'});
            else {
                AuthenticateToken.findOne({
                        refresh_token: req.body.token
                    },
                    '_id refresh_token_expiration _user',
                    function (err, token) {
                        if (err) {
                            err.httpRes = res;
                            throw err;
                        }

                        if (!token) {
                            res.status(400).json({message: 'Authentication failed'});
                        } else {

                            var currentDate = new Date();

                            if (token.refresh_token_expiration >= currentDate) {

                                User.findById(token._user, 'last_authentication', function (err, user) {
                                    if (err) {
                                        err.httpRes = res;
                                        throw err;
                                    }

                                    if (user) {

                                        var refresh_token;
                                        var refresh_token_expiration;

                                        if (req.body.refreshToken === true) {
                                            refresh_token = generator.generateToken();
                                            refresh_token_expiration = new Date().setSeconds(currentDate.getSeconds() + nconf.get('refresh_token_duration'));
                                        }

                                        var newToken = new AuthenticateToken({
                                            authorization_token: generator.generateToken(),
                                            authorization_token_expiration: new Date().setSeconds(currentDate.getSeconds() + nconf.get('authorization_token_duration')),
                                            refresh_token: refresh_token,
                                            refresh_token_expiration: refresh_token_expiration,
                                            _user: token._user,
                                            creation_ip: req.connection.remoteAddress
                                        });

                                        database.save(newToken, function (err) {
                                            if (err) {
                                                err.httpRes = res;
                                                throw err;
                                            }

                                            token.remove(function (err) {
                                                if (err) {
                                                    err.httpRes = res;
                                                    throw err;
                                                }

                                                var last_authentication = user.last_authentication;
                                                user.last_authentication = new Date();

                                                database.save(user, function (err) {
                                                    if (err) {
                                                        err.httpRes = res;
                                                        throw err;
                                                    }

                                                    res.status(201).json({
                                                        userId: newToken._user,
                                                        last_authentication: last_authentication,
                                                        authorizationToken: newToken.authorization_token,
                                                        authorizationTokenExpiration: newToken.authorization_token_expiration,
                                                        refreshToken: newToken.refresh_token,
                                                        refreshTokenExpiration: newToken.refresh_token_expiration
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    else
                                        res.status(400).json({message: 'Authentication failed'});
                                });
                            } else {
                                res.status(400).json({message: 'Token has expired'});
                            }
                        }
                    });
            }
        });

    router.route('/logout')
        .delete(function (req, res, next) {
            auth(req, res, next)
        }, function (req, res, next) {
            if (req.query.all !== 'true') {
                AuthenticateToken.findOneAndRemove({
                        authorization_token: req.headers.authorization
                    },
                    function (err) {
                        if (err) {
                            err.httpRes = res;
                            throw err;
                        }

                        res.status(204).json()
                    });
            }
            else {
                AuthenticateToken.remove({
                        _user: req.me._id
                    },
                    function (err) {
                        if (err) {
                            err.httpRes = res;
                            throw err;
                        }

                        res.status(204).json()
                    });
            }
        });
};
