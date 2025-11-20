/**
 * PackingList model
 *
 * Defines the `packingList` Sequelize model which represents a parsed
 * packing list document and its processing status within the PLP service.
 *
 * Behaviour notes:
 * - Exports a factory function returning the model definition.
 * - Uses `freezeTableName` to preserve table naming in migrations.
 */
module.exports = function definePackingListModel(sequelize, DataTypes) {
  /**
   * Model fields
   * - applicationId: primary key used to link items and other resources
   * - registrationApprovalNumber: parsed RMS/approval identifier
   * - allRequiredFieldsPresent: boolean result from validation
   * - parserModel: name of the parser/model that matched the document
   * - reasonsForFailure: textual reasons when validation fails
   * - dispatchLocationNumber: origin establishment number
   */
  const PackingList = sequelize.define(
    "packingList",
    {
      applicationId: { type: DataTypes.BIGINT, primaryKey: true },
      registrationApprovalNumber: DataTypes.STRING,
      allRequiredFieldsPresent: DataTypes.BOOLEAN,
      parserModel: DataTypes.STRING,
      reasonsForFailure: DataTypes.STRING,
      dispatchLocationNumber: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    },
  );

  /**
   * Associate PackingList with Item
   * @param {Object} models - Sequelize models collection
   */
  PackingList.associate = function (models) {
    models.packingList.hasMany(models.item, {
      foreignKey: "applicationId",
      targetKey: "applicationId",
    });
  };
  return PackingList;
};
