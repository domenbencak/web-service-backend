var express = require('express');
var router = express.Router();
var deviceDataController = require('../controllers/deviceDataController.js');

/*
 * GET
 */
router.get('/', deviceDataController.list);

/*
 * GET
 */
router.get('/:id', deviceDataController.show);

/*
 * POST
 */
router.post('/', deviceDataController.create);

/*
 * PUT
 */
router.put('/:id', deviceDataController.update);

/*
 * DELETE
 */
router.delete('/:id', deviceDataController.remove);

module.exports = router;
