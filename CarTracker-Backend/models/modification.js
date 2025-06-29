module.exports = (sequelize, DataTypes) => {
    const Modification = sequelize.define('Modification', {
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

    Modification.associate = (models) => {
        Modification.belongsTo(models.Car);
    };

    return Modification;
};