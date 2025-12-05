const config = require("../config");
const logger = require("../utilities/logger");
const mdmService = require("./mdm-service");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const mdmConfig = config.mdmConfig;

// Configurable local data file path
const localIneligbileItemsDataFilePath =
  process.env.MDM_INELIGIBLE_ITEMS_FILE || "./data/data-ineligible-items.json";

const getIneligibleItemsMethod = "getIneligibleItems()";
const getLocalIneligibleItemsMethod = "getLocalIneligibleItems()";

/**
 * Get ineligible items list - either from local file or MDM API
 * @returns {Promise<Array>} Array of ineligible items
 */
async function getIneligibleItems() {
  // Check if we should use local data
  if (mdmConfig.useLocalData === true) {
    logger.logInfo(
      filenameForLogging,
      getIneligibleItemsMethod,
      "Using local ineligible items data (MDM_USE_LOCAL_DATA=true)",
    );
    return getLocalIneligibleItems();
  }

  try {
    // Call MDM API to get ineligible items
    logger.logInfo(
      filenameForLogging,
      getIneligibleItemsMethod,
      "Fetching ineligible items from MDM API",
    );
    const items = await mdmService.getNirmsIneligibleItems();

    if (!items) {
      logger.logError(
        filenameForLogging,
        getIneligibleItemsMethod,
        "Failed to retrieve ineligible items - MDM API unavailable and no cache available",
      );
      throw new Error(
        "Failed to retrieve ineligible items - MDM API unavailable and no cache available",
      );
    }

    return items;
  } catch (error) {
    logger.logError(
      filenameForLogging,
      getIneligibleItemsMethod,
      `Error fetching from MDM API: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get local ineligible items data directly (for testing/fallback)
 * @returns {Array} Array of ineligible items from local file
 */
function getLocalIneligibleItems() {
  try {
    logger.logInfo(
      filenameForLogging,
      getLocalIneligibleItemsMethod,
      `Loading local ineligible items from: ${localIneligbileItemsDataFilePath}`,
    );
    const localIneligibleItemsData = require(localIneligbileItemsDataFilePath);
    logger.logInfo(
      filenameForLogging,
      getLocalIneligibleItemsMethod,
      `Successfully loaded ${localIneligibleItemsData?.length || 0} ineligible items from local file`,
    );
    return localIneligibleItemsData;
  } catch (error) {
    logger.logError(
      filenameForLogging,
      getLocalIneligibleItemsMethod,
      `Failed to load local ineligible items file: ${error.message}`,
    );
    throw error;
  }
}

module.exports = {
  getIneligibleItems,
  getLocalIneligibleItems,
};
