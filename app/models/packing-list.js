models.exports = (sequelize, DataTypes) => {
    const PackingList = sequelize.define('packingList', {
        applicationId: { type: DataTypes.INTEGER, primaryKey: true}, // id from ehco?
        registrationApprovalNumber: DataTypes.STRING,
        allRequiredFieldsPresent: DataTypes.BOOLEAN
    }, {})
    PackingList.associate = function (models) {
        models.packingList.hasMany(models.item, { foreignKey: 'applicationId', targetKey: 'applicationId'}) // should we use a separate id?
    }
    return PackingList
}