const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION 💥, shutting down...');
    server.close(() => {
        process.exit(1);
    });
});
