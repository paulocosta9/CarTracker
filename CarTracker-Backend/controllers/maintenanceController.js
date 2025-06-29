const db = require('../models');

exports.createMaintenance = async (req, res) => {
    try {
        const maintenance = await db.Maintenance.create({
            ...req.body,
            carId: req.params.carId
        });
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCarMaintenance = async (req, res) => {
    try {
        const maintenance = await db.Maintenance.findAll({
            where: { carId: req.params.carId }
        });
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};