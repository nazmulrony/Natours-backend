const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello form the middleware!👀');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello from the server side.',
        app: 'Natours',
    });
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const requestTime = req.requestTime;
    const tour = tours.find((item) => item.id === id);
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        requestTime,
        data: { tour },
    });
};

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: '<Updated Tour here>',
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
//using the similar url

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app.route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

// START THE SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
