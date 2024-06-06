models.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        itemId: { type: DataTypes.UUID, primaryKey: true },
        description: DataTypes.STRING,
        natureOfProducts: DataTypes.STRING,
        typeOfTreatment: DataTypes.STRING,
        commodityCode: DataTypes.INTEGER, // leading 0?
        numberOfPackages: DataTypes.INTEGER,
        totalWeight: DataTypes.FLOAT, // says int in schema? check what it returns typeof
        applicationId: DataTypes.INTEGER
    }, {})
    Item.associate = function (models) {
        models.item.belongsTo(models.packingList, { foreignKey: 'applicationId', targetKey: 'applicationId'})
    }
    return Item
}