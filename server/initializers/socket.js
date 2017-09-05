var socket = require('socket.io');
var logger = require('winston');
var requiredir = require('require-dir');

module.exports = function (server, cb) {
    'use strict';

    logger.info('[SOCKET] Initializing socket.io');

    var io = socket.listen(server);

    var socketPath = '../socket/';
    var socketDirs = requiredir(socketPath);

    io.sockets.on('connection', function (socket) {

        // Initialize all socket functions
        Object.keys(socketDirs).forEach(function (routeName) {
            require(socketPath + routeName)(socket);
        });
    });

    cb(null, server);
};

