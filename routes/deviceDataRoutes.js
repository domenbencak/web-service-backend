var express = require('express');
var router = express.Router();
var deviceDataController = require('../controllers/deviceDataController.js');

/*
 * GET
 */
router.get('/', deviceDataController.list);
router.get('/publish', deviceDataController.publish);
router.get('/:id', deviceDataController.show);

/*
 * POST
 */
router.post('/', function(req, res, next) {
  console.log('Received POST request to /deviceData'); // Add this line
  deviceDataController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', deviceDataController.update);

/*
 * DELETE
 */
router.delete('/:id', deviceDataController.remove);

module.exports = router;
