models.exports = (sequelize, DataTypes) => {
    const PackingList = sequelize.define('packingList', {
        packingListId: { type: DataTypes.UUID, primaryKey: true},
        registrationApprovalNumber: DataTypes.STRING,
        allRequiredFieldsPresent: DataTypes.BOOLEAN
    }, {})
    PackingList.associate = function (models) {
        models.packingList.hasMany(models.item, { foreignKey: 'packingListId', targetKey: 'packingListId'})
    }
    return PackingList
}