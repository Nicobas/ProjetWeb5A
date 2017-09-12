var AuthenticateToken = require('../models/AuthenticateToken');
var User = require('../models/User');

module.exports = function (req, res, cb, fields) {
    if (!req.headers.authorization)
        res.status(401).json({message: 'Unauthorized'});
    else {
        AuthenticateToken.findOne({
                authorization_token: req.headers.authorization
            },
            'authorization_token_expiration _user',
            function (err, token) {
                if (err) {
                    err.httpRes = res;
                    throw err;
                }

                if (!token)
                    res.status(401).json({message: 'Unauthorized'});
                else if (token.authorization_token_expiration < new Date())
                    res.status(401).json({message: 'Authorization token has expired'});
                else {
                    fields = '_id pseudo ' + fields;
                    User.findById(token._user, fields, function (err, user) {
                        if (err) {
                            err.httpRes = res;
                            throw err;
                        }

                        if (!user)
                            res.status(401).json({message: 'Unauthorized'});

                        req.me = user;
                        cb();
                    });
                }
            });
    }
}