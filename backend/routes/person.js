const express = require('express');

const router = express.Router();

const personController = require('../controllers/person');

router.get('/:dni', personController.getOneByDni);
router.get('/:dni/lastAddress', personController.getLastAddressByDni);
router.put('/:dni', personController.updateOneByDni);
router.delete('/:dni', personController.deleteOneByDni);
router.post('/', personController.createOne);

module.exports = router;
