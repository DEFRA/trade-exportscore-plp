models.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        itemId: { type: DataTypes.UUID, primaryKey: true },
        description: DataTypes.STRING,
        natureOfProducts: DataTypes.STRING,
        typeOfTreatment: DataTypes.STRING,
        commodityCode: DataTypes.INTEGER,
        numberOfPackages: DataTypes.INTEGER,
        totalWeight: DataTypes.INTEGER,
        packingListId: DataTypes.UUID
    }, {})
    Item.associate = function (models) {
        models.item.belongsTo(models.packingList, { foreignKey: 'packingListId', targetKey: 'packingListId'})
    }
    return Item
}