const db = require('../models');

exports.createModification = async (req, res) => {
    try {
        const modification = await db.Modification.create({
            ...req.body,
            carId: req.params.carId
        });
        res.status(201).json(modification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCarModifications = async (req, res) => {
    try {
        const modifications = await db.Modification.findAll({
            where: { carId: req.params.carId }
        });
        res.json(modifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};