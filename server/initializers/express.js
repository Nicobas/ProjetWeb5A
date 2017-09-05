var nconf = require('nconf');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var express = require('express');

module.exports = function (cb) {
    'use strict';

    var app = express();

    app.use(morgan('common'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json({type: '*/*'}));

    logger.info('[EXPRESS] Initializing routes');
    require('../routes/index')(app);

    // Error handler
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: (nconf.get('environment') === 'dev' ? err : {})
        });
        next(err);
    });

    cb(null, app);
};
