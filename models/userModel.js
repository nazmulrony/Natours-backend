const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name!']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email.'],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirm is required']
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
