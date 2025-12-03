const config = require("../config");
const logger = require("../utilities/logger");
const mdmService = require("./mdm-service");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const mdmConfig = config.mdmConfig;

// Local data fallback
const localIneligibleItemsData = require("./data/data-prohibited-items.json");

/**
 * Get ineligible items list - either from local file or MDM API
 * @returns {Promise<Array>} Array of ineligible items
 */
async function getIneligibleItems() {
  // Check if we should use local data
  if (mdmConfig.useLocalData === true) {
    logger.logInfo(
      filenameForLogging,
      "getIneligibleItems()",
      "Using local ineligible items data (MDM_USE_LOCAL_DATA=true)",
    );
    return localIneligibleItemsData;
  }

  try {
    // Call MDM API to get ineligible items
    logger.logInfo(
      filenameForLogging,
      "getIneligibleItems()",
      "Fetching ineligible items from MDM API",
    );
    const items = await mdmService.getNirmsIneligibleItems();

    if (!items) {
      logger.logError(
        filenameForLogging,
        "getIneligibleItems()",
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
      "getIneligibleItems()",
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
  return localIneligibleItemsData;
}

module.exports = {
  getIneligibleItems,
  getLocalIneligibleItems,
};
