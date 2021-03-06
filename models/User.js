const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nanoid = require('nanoid');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['admin', 'user']
    },
    facebookId: {
        type: String
    },
    avatar: {
        type: String
    },
    name: {
        type: String,
        required: true
    }
});

UserSchema.methods.checkPassword = function(password) {
    return password === this.password;
};

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;