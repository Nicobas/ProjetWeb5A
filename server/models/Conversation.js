var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Schema defines how the user data will be stored in MongoDB
var ConversationSchema = new Schema({
    messages: [
        {
            _author: {
                type: ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String
            },
            creation_date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    participant: [
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
    creation_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);