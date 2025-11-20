/**
 * Item model
 *
 * Defines the `item` Sequelize model which stores individual rows
 * extracted from a packing list by the parser pipeline.
 *
 * Behaviour notes:
 * - Exports a factory function that returns the model definition.
 * - Uses `freezeTableName` to keep the table name as defined.
 * - Fields mirror the standardized parser output used across the PLP service.
 */
module.exports = function defineItemModel(sequelize, DataTypes) {
  /**
   * Model fields
   * - itemId: UUID primary key for the item record
   * - description: description text from the packing list row
   * - natureOfProducts, typeOfTreatment: parser-derived fields
   * - commodityCode: HS/commodity code if present
   * - numberOfPackages: integer count of packages
   * - totalWeight: numeric weight value
   * - applicationId: foreign key linking to the packing list (packingList.applicationId)
   * - countryOfOrigin: ISO/Country text when available
   * - totalWeightUnit: unit string (e.g., 'kg')
   * - nirms: boolean flag for NIRMS marking
   */
  const item = sequelize.define(
    "item",
    {
      itemId: { type: DataTypes.UUID, primaryKey: true },
      description: DataTypes.STRING,
      natureOfProducts: DataTypes.STRING,
      typeOfTreatment: DataTypes.STRING,
      commodityCode: DataTypes.STRING,
      numberOfPackages: DataTypes.INTEGER,
      totalWeight: DataTypes.FLOAT,
      applicationId: DataTypes.BIGINT,
      countryOfOrigin: DataTypes.STRING,
      totalWeightUnit: DataTypes.STRING,
      nirms: DataTypes.BOOLEAN,
    },
    {
      freezeTableName: true,
    },
  );

  /**
   * Associate Item with PackingList
   * @param {Object} models - Sequelize models collection
   */
  item.associate = function (models) {
    models.item.belongsTo(models.packingList, {
      foreignKey: "applicationId",
      targetKey: "applicationId",
    });
  };

  return item;
};
