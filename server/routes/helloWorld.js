module.exports = function (router) {
    'use strict';

    router.route('/')
        .get(function (req, res, next) {
            res.status(200).json({message: "Hello world !"})
        }, function (req, res, next) {
            User.findOne({pseudo: req.params.pseudo}, function (err, o) {
                if (err) {
                    err.httpRes = res;
                    throw err;
                }

                res.status(200).json({
                    userId: o ? o._id : null
                });
            });
        });
}