const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello from the server side.',
        app: 'Natours'
    });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('/*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `can't fin ${req.originalUrl} on this server`
    // });
    const error = new Error(`can't fin ${req.originalUrl} on this server`);
    error.status = 'fail';
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    res.status(err.statusCode).json({
        status: false,
        message: err.message
    });
});

module.exports = app;
