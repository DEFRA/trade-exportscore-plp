module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('item', {
    itemId: { type: DataTypes.UUID, primaryKey: true },
    description: DataTypes.STRING,
    natureOfProducts: DataTypes.STRING,
    typeOfTreatment: DataTypes.STRING,
    commodityCode: DataTypes.STRING,
    numberOfPackages: DataTypes.INTEGER,
    totalWeight: DataTypes.FLOAT,
    applicationId: DataTypes.BIGINT
  }, {
    freezeTableName: true
  })
  Item.associate = function (models) {
    models.item.belongsTo(models.packingList, { foreignKey: 'applicationId', targetKey: 'applicationId' })
  }
  return Item
}
