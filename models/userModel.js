const crypto = require('crypto');
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
    role: {
        type: String,
        enum: {
            values: ['user', 'guide', 'lead-guide', 'admin'],
            message: 'Invalid user role!'
        },
        default: 'user'
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

        // This only works on CREATE and SAVE!!!
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: 'Passwords are not the same.'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// middleware to check if both password and the confirm passwords are same
userSchema.pre('save', async function(next) {
    // Only runs this function if the password was actually modified
    if (!this.isModified('password')) return next();

    // Hashing the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete the passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

// middleware to update the changedPasswordAt property
userSchema.pre('save', async function(next) {
    // Only runs this function if the password was actually modified
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; //This is because sometimes saving to database takes more time than issuing Jwt token.
    next();
});

// Query middleware to filter out the inactive users
userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});

// Instance method
//METHOD CHECK if the password is correct during sign in or update password
userSchema.methods.isPasswordCorrect = async function(
    inputPassword,
    userPassword
) {
    return await bcrypt.compare(inputPassword, userPassword);
};

// instance method to check if password was changed
userSchema.methods.isPasswordChangedAfter = async function(JwtTimestamp) {
    if (this.passwordChangedAt) {
        const changedPasswordStamp = this.passwordChangedAt.getTime() / 1000; //changing ms to seconds
        console.log(JwtTimestamp, changedPasswordStamp);
        return JwtTimestamp < changedPasswordStamp;
    }
    return false;
};

// instance method to generate resetPassword token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken, encrypted: this.passwordResetToken });
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
