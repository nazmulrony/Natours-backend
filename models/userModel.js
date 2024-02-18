const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name.']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: 'Passwords are not the same.'
        }
    }
});

userSchema.pre('save', async function(next) {
    // Only runs this function if the password was actually modified
    if (!this.isModified('password')) return next();

    // Hashing the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete the passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
