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

// ====================== MODELS ======================

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
});

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
        allowNull: false,
        validate: {
            min: 1900,
            max: new Date().getFullYear() + 1
        }
    },
    vin: {
        type: DataTypes.STRING(17),
        unique: true,
        validate: {
            len: [17, 17]
        }
    },
    purchaseDate: DataTypes.DATEONLY,
    purchasePrice: DataTypes.DECIMAL(10, 2),
    currentMileage: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
});

const Maintenance = sequelize.define('Maintenance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    serviceType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cost: DataTypes.DECIMAL(10, 2),
    mileage: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    receiptUrl: DataTypes.STRING
});

const Modification = sequelize.define('Modification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    cost: DataTypes.DECIMAL(10, 2),
    installDate: DataTypes.DATEONLY,
    warrantyExpiry: DataTypes.DATEONLY,
    installer: DataTypes.STRING
});

const FutureMod = sequelize.define('FutureMod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estimatedCost: DataTypes.DECIMAL(10, 2),
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
    },
    targetDate: DataTypes.DATEONLY,
    notes: DataTypes.TEXT
});

// ====================== RELATIONSHIPS ======================

User.hasMany(Car);
Car.belongsTo(User);

Car.hasMany(Maintenance);
Maintenance.belongsTo(Car);

Car.hasMany(Modification);
Modification.belongsTo(Car);

Car.hasMany(FutureMod);
FutureMod.belongsTo(Car);

// ====================== AUTH MIDDLEWARE ======================

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ====================== ROUTES ======================

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Car Routes
app.get('/api/cars', authenticate, async (req, res) => {
    try {
        const cars = await Car.findAll({
            where: { userId: req.user.id },
            include: [Maintenance, Modification, FutureMod]
        });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cars', authenticate, async (req, res) => {
    try {
        const car = await Car.create({ ...req.body, userId: req.user.id });
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Maintenance Routes
app.post('/api/cars/:carId/maintenance', authenticate, async (req, res) => {
    try {
        const maintenance = await Maintenance.create({
            ...req.body,
            carId: req.params.carId
        });
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Modification Routes
app.post('/api/cars/:carId/modifications', authenticate, async (req, res) => {
    try {
        const modification = await Modification.create({
            ...req.body,
            carId: req.params.carId
        });
        res.status(201).json(modification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Future Mod Routes
app.post('/api/cars/:carId/future-mods', authenticate, async (req, res) => {
    try {
        const futureMod = await FutureMod.create({
            ...req.body,
            carId: req.params.carId
        });
        res.status(201).json(futureMod);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ====================== SERVER INIT ======================

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('Database synchronized');
    });
}).catch(err => {
    console.error('Database sync failed:', err);
});