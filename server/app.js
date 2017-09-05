var expressInit = require('./initializers/express');
var databaseInit = require('./initializers/database');
var httpsInit = require('./initializers/https');

var errorManager = require('./services/errorManager');

var nconf = require('nconf');
var async = require('async');
var logger = require('winston');

'use strict';

logger.info('[API] Load parameters');

nconf.use('memory');
require('./parameters');

logger.info('[API] Starting initialization');

if (nconf.get('environment') === 'dev')
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

process.on('uncaughtException', function (err) {
    errorManager(err, 'api');
});
logger.info('[ERRORS] Handled !');

// Initialize Modules
async.waterfall(
    [
        function (callback) {
            // Initialise DB connection
            databaseInit(callback);
        },
        function (callback) {
            // Initialize Express
            expressInit(callback);
        },
        function (app, callback) {
            httpsInit(app, callback);
        },
        function (server, callback) {
            // Run server listener
            server.listen(nconf.get('api_server_port'));
            logger.info('[API] Listening on port ' + nconf.get('api_server_port'));

            callback();
        }
    ],
    function (err) {
        if (err) {
            logger.error('[API] Initialization failed', err);
        } else {
            logger.info('[API] Initialized SUCCESSFULLY');
        }
    }
);