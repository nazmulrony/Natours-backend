const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const { Schema } = mongoose;

const tourSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'The tour must have a name.'],
            trim: true,
            unique: true
        },
        slug: String,
        isSecret: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty']
        },
        ratingAverage: {
            type: Number,
            default: 4.5
        },
        ratingQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'Price must be a number.']
        },
        priceDiscount: Number,
        summary: {
            type: String,
            trim: true, //removes the white spaces in the beginning and in the end
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false //this line doesn't send this field in the response
        },
        startDates: [Date]
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual('durationWeeks').get(function() {
    return (this.duration / 7).toFixed(2);
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
// tourSchema.pre('save', function(next) {
//     console.log('Document to be saved..');
//     next();
// });

// mongoose post  middleware: runs after .save() and .create() and doesn't have access to this keyword
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY middleware
tourSchema.pre(/^find/, function(next) {
    this.find({ isSecret: { $ne: true } });
    this.start = Date.now();
    next();
});

// query post middleware has the access to this keyword
tourSchema.post(/^find/, function(docs, next) {
    console.log(
        `Query took ${Date.now() - this.start} milliseconds to execute.`
    );
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
