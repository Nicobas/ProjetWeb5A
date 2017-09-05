var logger = require('winston');
var nconf = require('nconf');
var mongoose = require('mongoose');

module.exports = function (cb) {
    'use strict';

    logger.info('[DATABASE] Connection to mongodb');
    mongoose.Promise = global.Promise;
    mongoose.connect(nconf.get('database'), {
        useMongoClient: true
    });

    cb();
};
