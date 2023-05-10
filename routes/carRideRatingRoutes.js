var express = require('express');
var router = express.Router();
var carRideRatingController = require('../controllers/carRideRatingController.js');

/*
 * GET
 */
router.get('/', carRideRatingController.list);

/*
 * GET
 */
router.get('/:id', carRideRatingController.show);

/*
 * POST
 */
router.post('/', carRideRatingController.create);

/*
 * PUT
 */
router.put('/:id', carRideRatingController.update);

/*
 * DELETE
 */
router.delete('/:id', carRideRatingController.remove);

module.exports = router;
