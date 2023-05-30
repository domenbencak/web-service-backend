var express = require('express');
var router = express.Router();
var carRideController = require('../controllers/carRideController.js');

// Overrides the method for the sent request to the correct one
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

/*
 * GET
 */
router.get('/', carRideController.list);
router.get('/getLongLat/:id', carRideController.retrieveLongLatFromCarRide);
//router.get('/mapShowcase', carRideController.showMapShowcase);

/*
 * GET
 */
router.get('/:id', carRideController.show);

/*
 * POST
 */
router.post('/', carRideController.create);

/*
 * PUT
 */
router.put('/:id', carRideController.update);
router.put('/:id/updateRideMobile', carRideController.updateCarRideMobile);

/*
 * DELETE
 */
router.delete('/:id', carRideController.remove);

module.exports = router;
