module.exports = (sequelize, DataTypes) => {
    const Maintenance = sequelize.define('Maintenance', {
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

    Maintenance.associate = (models) => {
        Maintenance.belongsTo(models.Car);
    };

    return Maintenance;
};