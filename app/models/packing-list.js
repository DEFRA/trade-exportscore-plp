module.exports = (sequelize, DataTypes) => {
  const PackingList = sequelize.define(
    "packingList",
    {
      applicationId: { type: DataTypes.BIGINT, primaryKey: true },
      registrationApprovalNumber: DataTypes.STRING,
      allRequiredFieldsPresent: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
    },
  );
  PackingList.associate = function (models) {
    models.packingList.hasMany(models.item, {
      foreignKey: "applicationId",
      targetKey: "applicationId",
    }); // should we use a separate id?
  };
  return PackingList;
};
