const express = require('express');

const router = express.Router();

const personController = require('../controllers/person');
const notAllowedController = require('../controllers/notAllowed');

router.get('/', personController.getAll);
router.delete('/', personController.deleteAll);

/** Added just for demo purposes */
router.post('/', notAllowedController);
router.put('/', notAllowedController);

module.exports = router;
