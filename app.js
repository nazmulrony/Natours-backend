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

app.all('/*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `can't fin ${req.originalUrl} on this server`
    });
});

app.use((error, req, res, next) => {
    error.stausCode = error.statusCode || 500;
    error.status = error.status || 'fail';

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
});

module.exports = app;
