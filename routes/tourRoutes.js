const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

//param middleware
// router.param('id', tourController.checkID);

// aliasing
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

//aggregate pipeline Routes
router.route('/get-tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
