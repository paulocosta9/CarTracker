const express = require('express');
const router = express.Router();
const futureModController = require('../controllers/futureModController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/:carId', futureModController.createFutureMod);
router.get('/:carId', futureModController.getCarFutureMods);

module.exports = router;