/**
 * Packing-list persistence helper
 *
 * Provides helpers to map parsed packing list JSON to database models
 * and persist them within a transaction. The module follows project
 * conventions for error handling (logging via `logger`) and uses
 * validation utilities to normalise specific field values (e.g. NIRMS).
 */
const { models, sequelize } = require("../services/database-service");
const { v4: uuidv4 } = require("uuid");
const logger = require("./../utilities/logger");
const {
  isNirms,
  isNotNirms,
} = require("../services/validators/packing-list-validator-utilities");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Persist a parsed packing list and its items inside a transaction.
 *
 * This function maps the incoming parser JSON into the DB shape and
 * writes both the `packingList` and its `item` rows atomically. Errors
 * are logged and do not rethrow - callers should interpret failures
 * from logs or surrounding orchestration.
 *
 * @param {Object} packingListJson - Parser output JSON for a packing list
 * @param {number|string} applicationId - Primary id used to link items
 */
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

/**
 * Map parser JSON into the `packingList` DB shape.
 *
 * The function performs a best-effort mapping and logs any unexpected
 * structure problems. It returns `undefined` on error to allow callers
 * to detect mapping failures (the caller currently logs errors).
 *
 * @param {Object} packingListJson - Parser output JSON
 * @param {number|string} applicationId - Primary id to assign to the record
 * @returns {Object|undefined} - Mapped packing list object or undefined
 */
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

/**
 * Format sheet/page location from row_location object.
 * @param {Object} rowLocation - Row location object with sheetName or pageNumber
 * @returns {string|null} Formatted location string or null
 */
function getSheetPageLocation(rowLocation) {
  if (!rowLocation) {
    return null;
  }
  if (rowLocation.sheetName) {
    return `Sheet ${rowLocation.sheetName}`;
  }
  if (rowLocation.pageNumber) {
    return `Page ${rowLocation.pageNumber}`;
  }
  return null;
}

/**
 * Map a single parser item row into the `item` DB shape.
 *
 * Normalises special fields such as NIRMS using validator utilities.
 * The helper returns `null` for NIRMS when the input is neither a
 * recognised true nor false value so that callers can distinguish
 * between explicit false and unknown.
 *
 * @param {Object} o - Single item object from the parser JSON
 * @param {number|string} applicationId - Foreign key for the parent packing list
 * @returns {Object|undefined} - Mapped item object or undefined on error
 */
function itemsMapper(o, applicationId) {
  /**
   * Convert NIRMS string value to boolean using validation utilities.
   * @param {string} nirmsValue - NIRMS value to convert
   * @returns {boolean|null} True for NIRMS, false for not-NIRMS, null for invalid
   */
  const getNirmsBooleanValue = (nirmsValue) => {
    if (isNirms(nirmsValue)) {
      return true;
    } else if (isNotNirms(nirmsValue)) {
      return false;
    } else {
      return null;
    } // For invalid or missing values
  };

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
      nirms: getNirmsBooleanValue(o.nirms),
      row: o.row_location?.rowNumber ?? null,
      location: getSheetPageLocation(o.row_location),
      failure: o.failure ?? null,
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
