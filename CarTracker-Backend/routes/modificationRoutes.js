const express = require('express');
const router = express.Router();
const modificationController = require('../controllers/modificationController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/:carId', modificationController.createModification);
router.get('/:carId', modificationController.getCarModifications);

module.exports = router;