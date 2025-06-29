const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await db.User.findByPk(decoded.id);
        if (!req.user) return res.status(401).json({ error: 'Invalid user' });

        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};