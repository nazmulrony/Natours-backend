const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The tour must have a name.'],
        unique: true
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

module.exports = Tour;
