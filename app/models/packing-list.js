module.exports = (sequelize, DataTypes) => {
  const PackingList = sequelize.define('packingList', {
    applicationId: { type: DataTypes.INTEGER, primaryKey: true },
    registrationApprovalNumber: DataTypes.STRING,
    allRequiredFieldsPresent: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    timestamps: false
  })
  PackingList.associate = function (models) {
    models.packingList.hasMany(models.item, { foreignKey: 'applicationId', targetKey: 'applicationId' }) // should we use a separate id?
  }
  return PackingList
}
