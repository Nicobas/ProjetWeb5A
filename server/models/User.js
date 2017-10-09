var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Schema defines how the user data will be stored in MongoDB
var UserSchema = new Schema({
    pseudo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    phrase: {
        type: String,
    },
    password_hash: {
        type: String
    },
    // status: {
    //     type: String,
    //     enum: ['Online', 'Busy', 'Away', 'Offline'],
    //     required: true
    // },
    contacts: [
        {
            _user: {
                type: ObjectId,
                ref: 'User',
                required: true
            },
            creation_date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    conversations: [
        {
            _conversation: {
                type: ObjectId,
                ref: 'Conversation',
                required: true
            },
            creation_date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    last_authentication: {
        type: Date
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    creation_ip: {
        type: String
    }
});

// Saves the user's password hashed (plain text password storage is not good)
//pre va s'executer avant la fonction
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.password_hash && (this.isModified('password') || this.isNew)) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password_hash, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password_hash = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password_hash, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);