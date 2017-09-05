var https = require('https');
var fs = require('fs');
var logger = require('winston');
var nconf = require('nconf');

module.exports = function (app, cb) {
    'use strict';

    logger.info('[HTTPS] Initializing https');

    var server = https.createServer({
        key: fs.readFileSync(nconf.get('ssl_key_path')),
        cert: fs.readFileSync(nconf.get('ssl_cert_path')),
        ca: fs.readFileSync(nconf.get('ssl_ca_path'))
    }, app);

    cb(null, server);
};

