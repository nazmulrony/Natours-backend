const AppError = require('./../utils/appError');

const handleErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        //Programming error or other unknown error: don't leak error details
    } else {
        console.error('ERROR 🔥:', err);

        res.status(err.statusCode).json({
            status: 'error',
            err,
            message: 'Something went very wrong'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') error = handleErrorDB(error);
        console.log(error);
        sendErrorProd(error, res);
    }
};
