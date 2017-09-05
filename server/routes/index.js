var changeCase = require('change-case');
var express = require('express');
var routes = require('require-dir')();

module.exports = function (app) {
    'use strict';

    // Initialize all routes
    Object.keys(routes).forEach(function (routeName) {

        //console.log(routeName);

        var router = express.Router();

        // Initialize the route to add its functionality to router
        require('./' + routeName)(router);

        // Add router to the speficied route name in the app
        app.use('/' + routeName, router);
    });
};

