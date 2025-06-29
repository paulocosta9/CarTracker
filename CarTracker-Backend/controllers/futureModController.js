const db = require('../models');

exports.createFutureMod = async (req, res) => {
    try {
        const futureMod = await db.FutureMod.create({
            ...req.body,
            carId: req.params.carId
        });
        res.status(201).json(futureMod);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCarFutureMods = async (req, res) => {
    try {
        const futureMods = await db.FutureMod.findAll({
            where: { carId: req.params.carId }
        });
        res.json(futureMods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};