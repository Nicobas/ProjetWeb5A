var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Schema defines how the user data will be stored in MongoDB
var AuthenticateTokenSchema = new Schema({
    authorization_token: {
        type: String,
        unique: true,
        required: true
    },
    authorization_token_expiration: {
        type: Date,
        required: true
    },
    refresh_token: {
        type: String,
        sparse: true
    },
    refresh_token_expiration: {
        type: Date
    },
    _user : {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    creation_ip: {
        type: String
    }
});

module.exports = mongoose.model('AuthenticateToken', AuthenticateTokenSchema);