module.exports = (sequelize, DataTypes) => {
    const FutureMod = sequelize.define('FutureMod', {
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

    FutureMod.associate = (models) => {
        FutureMod.belongsTo(models.Car);
    };

    return FutureMod;
};