const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create Error if the user POSTs the password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('You can not use this route for password updates', 400)
        );
    }

    // 2) Update user document
    const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filteredBody,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
