const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/:carId', maintenanceController.createMaintenance);
router.get('/:carId', maintenanceController.getCarMaintenance);

module.exports = router;