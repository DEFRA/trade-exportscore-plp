/**
 * ISO Codes Service
 *
 * Manages retrieval of ISO country codes from either local file or MDM API.
 * Acts as the entry point for ISO codes data, delegating to appropriate source.
 *
 * Data Source Selection:
 * - Local File: When MDM_USE_LOCAL_DATA=true (default for development/testing)
 * - MDM API: When MDM_USE_LOCAL_DATA=false (production environments)
 *
 * Error Handling:
 * - Local mode: Throws error if local file cannot be loaded
 * - MDM mode: Throws error if API fails (resilience handled by mdm-service layer)
 *
 * Important Design Notes:
 * - This service does NOT implement stale cache fallback (handled by mdm-service)
 * - This service does NOT fallback to local file when MDM fails (fail-fast in production)
 * - Local file is for development/testing only, not a production fallback mechanism
 *
 * Methods:
 * - getIsoCodes(): Main entry point, routes to local file or MDM API
 * - getLocalIsoCodes(): Loads data from local JSON file
 *
 * Configuration:
 * - MDM_USE_LOCAL_DATA: Toggle between local file and MDM API
 * - MDM_ISO_CODES_FILE: Path to local data file (default: ./data/data-iso-codes.json)
 */

const config = require("../config");
const logger = require("../utilities/logger");
const mdmService = require("./mdm-service");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

const mdmConfig = config.mdmConfig;

// Configurable local data file path
const localIsoCodesDataFilePath =
  process.env.MDM_ISO_CODES_FILE || "./data/data-iso-codes.json";

const getIsoCodesMethod = "getIsoCodes()";
const getLocalIsoCodesMethod = "getLocalIsoCodes()";

/**
 * Get ISO codes list - either from local file or MDM API
 * @returns {Promise<Array>} Array of ISO country codes
 */
async function getIsoCodes() {
  // Check if we should use local data
  if (mdmConfig.useLocalData === true) {
    logger.logInfo(
      filenameForLogging,
      getIsoCodesMethod,
      "Using local ISO codes data (MDM_USE_LOCAL_DATA=true)",
    );
    return getLocalIsoCodes();
  }

  try {
    // Call MDM API to get countries
    logger.logInfo(
      filenameForLogging,
      getIsoCodesMethod,
      "Fetching ISO codes from MDM API",
    );
    const response = await mdmService.getCountries();

    if (!response) {
      logger.logError(
        filenameForLogging,
        getIsoCodesMethod,
        "Failed to retrieve ISO codes - MDM API unavailable and no cache available",
      );
      throw new Error(
        "Failed to retrieve ISO codes - MDM API unavailable and no cache available",
      );
    }

    // Extract countries array from response
    // Support various response structures:
    // - { countries: [...] }
    // - { data: { countries: [...] } }
    // - { data: [...] }
    // - [...]
    let countries = response;

    if (response.data && response.data.countries) {
      countries = response.data.countries;
    } else if (response.countries) {
      countries = response.countries;
    } else if (response.data && Array.isArray(response.data)) {
      countries = response.data;
    } else if (!Array.isArray(response)) {
      countries = [];
    }

    // Extract ISO codes from countries array
    // Support various property names: isoCode, code, iso2
    const isoCodes = Array.isArray(countries)
      ? countries
          .map(
            (country) =>
              country.isoCode || country.code || country.iso2 || null,
          )
          .filter((code) => code !== null && code !== undefined)
      : [];

    return isoCodes;
  } catch (error) {
    logger.logError(
      filenameForLogging,
      getIsoCodesMethod,
      `Error fetching from MDM API: ${error.message}`,
    );
    throw error;
  }
}

/**
 * Get local ISO codes data directly (for testing/fallback)
 * @returns {Array} Array of ISO codes from local file
 */
function getLocalIsoCodes() {
  try {
    logger.logInfo(
      filenameForLogging,
      getLocalIsoCodesMethod,
      `Loading local ISO codes from: ${localIsoCodesDataFilePath}`,
    );

    const isoCodesData = require(
      `./data/${path.basename(localIsoCodesDataFilePath)}`,
    );
    return isoCodesData;
  } catch (error) {
    logger.logError(
      filenameForLogging,
      getLocalIsoCodesMethod,
      `Failed to load local ISO codes file: ${error.message}`,
    );
    throw error;
  }
}

module.exports = { getIsoCodes, getLocalIsoCodes };
