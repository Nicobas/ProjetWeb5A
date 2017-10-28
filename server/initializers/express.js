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

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    logger.info('[EXPRESS] Initializing routes');
    require('../routes/index')(app);

    logger.info('[EXPRESS] Initializing public data');

    app.use(express.static(nconf.get('public_directory_path'), {
    }));

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
