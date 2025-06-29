const jwt = require('jsonwebtoken');
const db = require('../models');

exports.register = async (req, res) => {
    try {
        const user = await db.User.create(req.body);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { username: req.body.username } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await user.validPassword(req.body.password);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};