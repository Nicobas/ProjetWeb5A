module.exports = function (router) {
    'use strict';

    router.route('/')
        .get(function (req, res, next) {
            res.status(200).json({message: "Hello world !"})
        });


};