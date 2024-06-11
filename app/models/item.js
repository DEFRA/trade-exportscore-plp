module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        itemId: { type: DataTypes.UUID, primaryKey: true },
        description: DataTypes.STRING,
        natureOfProducts: DataTypes.STRING,
        typeOfTreatment: DataTypes.STRING,
        commodityCode: DataTypes.INTEGER,
        numberOfPackages: DataTypes.INTEGER,
        totalWeight: DataTypes.FLOAT,
        applicationId: DataTypes.INTEGER
    }, {
        freezeTableName: true,
        timestamps: false
    })
    Item.associate = function (models) {
        models.item.belongsTo(models.packingList, { foreignKey: 'applicationId', targetKey: 'applicationId' })
    }
    return Item
}