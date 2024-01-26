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

exports.getAllTours = async (req, res) => {
    try {
        // BUILD QUERY
        console.log('query', req.query);

        //1A) FILTERING
        const queryObj = { ...req.query }; //this line has to as object spread or sort, page, limit will get deleted from the query

        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryObj[element]);

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, match => `$${match}`);

        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // 2) SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query.sort('-createdAt');
        }

        // 3) FIELDS LIMITING (projection)
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            console.log('fields');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // EXECUTE THE QUERY
        const tours = await query;
        // const query =  Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

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
