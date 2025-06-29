const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', carController.getAllCars);
router.post('/', carController.createCar);

module.exports = router;