var express = require('express');
var router = express.Router();
var carRideController = require('../controllers/carRideController.js');

/*
 * GET
 */
router.get('/', carRideController.list);

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

/*
 * DELETE
 */
router.delete('/:id', carRideController.remove);

module.exports = router;
