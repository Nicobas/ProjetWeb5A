var UIDGenerator = require('uid-generator');

var nconf = require('nconf');

module.exports.generateToken = function(size) {
    var _size = !size ? nconf.get('default_token_size') : size;
    return new UIDGenerator(_size, UIDGenerator.BASE62).generateSync();
};