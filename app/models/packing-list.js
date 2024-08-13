module.exports = (sequelize, DataTypes) => {
  const PackingList = sequelize.define(
    "packingList",
    {
      applicationId: { type: DataTypes.BIGINT, primaryKey: true },
      registrationApprovalNumber: DataTypes.STRING,
      allRequiredFieldsPresent: DataTypes.BOOLEAN,
      parserModel: DataTypes.ENUM(modelEnums)
    },
    {
      freezeTableName: true,
    },
  );
  PackingList.associate = function (models) {
    models.packingList.hasMany(models.item, {
      foreignKey: "applicationId",
      targetKey: "applicationId",
    });
  };
  return PackingList;
};

modelEnums = {
  TJMORRIS1: "tjmorris-1",
  ASDA1: "asda-1",
  ASDA2: "asda-2",
  SAINSBURYS1: "sainsburys-1",
  BANDM1: "bandm-1",
  TESCO1: "tesco-1",
  TESCO2: "tesco-2",
  TESCO3: "tesco-3",
  FOWLERWELCH1: "fowlerwelch-1",
  NISA1: "nisa-1",
  NISA2: "nisa-2",
  BUFFALOAD1: "buffaload-1",
}
