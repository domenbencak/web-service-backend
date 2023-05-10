var express = require('express');
var router = express.Router();
var deviceDataController = require('../controllers/deviceDataController.js');

/*
 * GET
 */
router.get('/', deviceDataController.list);
console.log("POG");
router.get('/publish', deviceDataController.publish);
router.get('/:id', deviceDataController.show);

/*
 * POST
 */
router.post('/', deviceDataController.createRandom);

/*
 * PUT
 */
router.put('/:id', deviceDataController.update);

/*
 * DELETE
 */
router.delete('/:id', deviceDataController.remove);

module.exports = router;
