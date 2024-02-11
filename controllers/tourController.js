const Tour = require('./../models/tourModel');

const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';

    next();
};

exports.getAllTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // EXECUTE THE QUERY
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
        //202 status doesn't send any content in the response. The message below will not be sent
        status: 'success',
        data: { message: 'Tour successfully deleted' }
    });
});

exports.createTour = catchAsync(async (req, res, next) => {
    //same as const newTour = new Tour({}); newTour.save()
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
});

exports.getTourStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$ratingAverage',
                numTours: { $sum: 1 },
                numRatings: { $sum: 'ratingQuantity' },
                averageRating: { $avg: '$ratingAverage' },
                averagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                max: { $max: '$price' }
            }
        },
        {
            $sort: { averagePrice: 1 }
        }
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(201).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                //Groups documents by a specified identifier
                _id: { $month: '$startDates' }, //gets the month form a specified date
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);

    res.status(201).json({
        status: 'success',
        results: plan.length,
        data: { plan }
    });
});

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     const { name, price } = req.body;
//     if (!name || !price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();
// };
