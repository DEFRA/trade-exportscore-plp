const { models, sequelize } = require("../services/database-service");
const { v4: uuidv4 } = require("uuid");
const logger = require("./../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

async function createPackingList(packingListJson, applicationId) {
  try {
    await sequelize.transaction(async (transaction) => {
      const packingList = packingListMapper(packingListJson, applicationId);
      await models.packingList.create(packingList, {
        transaction,
      });
      await models.item.bulkCreate(packingList.item, { transaction });

      logger.logInfo(
        filenameForLogging,
        "createPackingList()",
        `Saved packing list in database with application id: ${packingList.applicationId}`,
      );
    });
  } catch (err) {
    logger.logError(filenameForLogging, "createPackingList()", err);
  }
}

function packingListMapper(packingListJson, applicationId) {
  try {
    return {
      applicationId,
      registrationApprovalNumber: packingListJson.registration_approval_number,
      allRequiredFieldsPresent:
        packingListJson.business_checks.all_required_fields_present,
      item: packingListJson.items.map((n) => itemsMapper(n, applicationId)),
      parserModel: packingListJson.parserModel,
      reasonsForFailure: packingListJson.business_checks.failure_reasons,
      dispatchLocationNumber: packingListJson.dispatchLocationNumber,
    };
  } catch (err) {
    logger.logError(filenameForLogging, "packingListMapper()", err);
    return undefined;
  }
}

function itemsMapper(o, applicationId) {
  try {
    return {
      itemId: uuidv4(),
      description: o.description,
      natureOfProducts: o.nature_of_products,
      typeOfTreatment: o.type_of_treatment,
      commodityCode: o.commodity_code,
      numberOfPackages: o.number_of_packages,
      totalWeight: o.total_net_weight_kg,
      totalWeightUnit: o.total_net_weight_unit,
      applicationId,
      countryOfOrigin: o.country_of_origin,
    };
  } catch (err) {
    logger.logError(filenameForLogging, "itemsMapper()", err);
    return undefined;
  }
}

module.exports = {
  createPackingList,
  itemsMapper,
  packingListMapper,
};
