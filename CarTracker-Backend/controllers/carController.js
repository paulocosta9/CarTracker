const db = require('../models');

exports.getAllCars = async (req, res) => {
    try {
        const cars = await db.Car.findAll({
            where: { userId: req.user.id },
            include: [
                { model: db.Maintenance },
                { model: db.Modification },
                { model: db.FutureMod }
            ]
        });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        const car = await db.Car.create({ ...req.body, userId: req.user.id });
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add other CRUD operations (getById, update, delete) as needed