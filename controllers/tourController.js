const Tour = require('./../models/tourModel');

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

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';

    next();
};

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //1A) FILTERING
        const queryObj = { ...this.queryString }; //this line has to as object spread or sort, page, limit will get deleted from the query

        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryObj[element]);

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, match => `$${match}`);

        console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

exports.getAllTours = async (req, res) => {
    try {
        // BUILD QUERY
        console.log('query', req.query);

        //1A) FILTERING
        // const queryObj = { ...req.query }; //this line has to as object spread or sort, page, limit will get deleted from the query

        // const excludedFields = ['sort', 'page', 'limit', 'fields'];
        // excludedFields.forEach(element => delete queryObj[element]);

        // // 1B) ADVANCED FILTERING
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, match => `$${match}`);

        // console.log(JSON.parse(queryStr));

        // let query = Tour.find(JSON.parse(queryStr));

        // 2) SORTING

        // 3) FIELDS LIMITING (projection)
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v');
        // }

        // 4) PAGINATION
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;
        // query = query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const tourCount = await Tour.countDocuments();
        //     if (skip >= tourCount) throw new Error('This page does not exist');
        // }
        // EXECUTE THE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: { tours }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            //202 status doesn't send any content in the response. The message below will not be sent
            status: 'success',
            data: { message: 'Tour successfully deleted' }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        //same as const newTour = new Tour({}); newTour.save()
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};
