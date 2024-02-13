const dotenv = require('dotenv');
const mongoose = require('mongoose');

//UNCAUGHT EXCEPTION HANDLER
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 💥, shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config();

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// console.log(process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB, {
        //these are some options to deal with deprecation warnings
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful'));

const port = 3000;

// START THE SERVER
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});

// UNHANDLED REJECTION HANDLER (asynchronous errors)
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION 💥, shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
