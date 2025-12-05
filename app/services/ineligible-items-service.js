const config = require("../config");
const logger = require("../utilities/logger");
const mdmService = require("./mdm-service");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const mdmConfig = config.mdmConfig;

// Configurable local data file path
const localIneligbileItemsDataFilePath =
  process.env.MDM_INELIGIBLE_ITEMS_FILE ||
  "./data/data-ineligible-items.json";

const getIneligibleItemsMethod = "getIneligibleItems()";

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
  const localIneligibleItemsData = require(localIneligbileItemsDataFilePath);
  return localIneligibleItemsData;
}

module.exports = {
  getIneligibleItems,
  getLocalIneligibleItems,
};
