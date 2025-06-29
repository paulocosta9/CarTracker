const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const modificationRoutes = require('./routes/modificationRoutes');
const futureModRoutes = require('./routes/futureModRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/modifications', modificationRoutes);
app.use('/api/future-mods', futureModRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;