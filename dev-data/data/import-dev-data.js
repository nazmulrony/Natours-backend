const dotenv = require('dotenv');
const mongoose = require('mongoose');

const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config();

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
        useFindAndModify: false
    })
    .then(() => console.log('DB connection successful'));

// READ DATA
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

// DELETE DATA

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
