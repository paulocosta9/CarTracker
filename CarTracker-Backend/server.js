require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

// Models
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Car = sequelize.define('Car', {
    make: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vin: {
        type: DataTypes.STRING(17),
        unique: true
    },
    purchaseDate: DataTypes.DATE,
    purchasePrice: DataTypes.FLOAT,
    currentMileage: DataTypes.INTEGER
});

// Other models (Maintenance, Modification) follow same pattern...

// Relationships
User.hasMany(Car);
Car.belongsTo(User);

// Initialize Database
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Use force: true ONLY for initial setup or when changing models
        await sequelize.sync({ force: true });
        console.log('🔄 Database synchronized');

        // After first run, change to:
        // await sequelize.sync({ alter: true });

    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

initializeDatabase();


// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) return res.status(404).send('User not found');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).send(token);
});

// Car Routes (protected)
app.get('/api/cars', authenticate, async (req, res) => {
    const cars = await Car.findAll({ where: { userId: req.user.id } });
    res.json(cars);
});

app.post('/api/cars', authenticate, async (req, res) => {
    const car = await Car.create({ ...req.body, userId: req.user.id });
    res.status(201).json(car);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});