const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        //these are some options to deal with deprecation warnings
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB connection successful'));

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The tour must have a name.']
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'Price must be a number.']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The forest hiker',
    rating: 4.8,
    price: 499
});

testTour
    .save()
    .then(doc => console.log(doc))
    .catch(err => console.log('Error 🔥', err));

const port = 3000;

// START THE SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
