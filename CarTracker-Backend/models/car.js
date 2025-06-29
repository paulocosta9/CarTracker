module.exports = (sequelize, DataTypes) => {
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

    Car.associate = (models) => {
        Car.belongsTo(models.User);
        Car.hasMany(models.Maintenance);
        Car.hasMany(models.Modification);
        Car.hasMany(models.FutureMod);
    };

    return Car;
};