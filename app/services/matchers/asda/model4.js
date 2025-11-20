/**
 * ASDA Model 4 matcher (CSV)
 *
 * Detects whether a provided CSV-converted packing list matches the
 * ASDA CSV Model 4 format by checking the establishment number and
 * header row patterns.
 */
const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers-csv");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Check whether the provided packing list matches ASDA Model 4 (CSV).
 * @param {Object|Array} packingList - Parsed CSV/JSON representation
 * @param {string} filename - Source filename for logging
 * @returns {string} - One of matcherResult codes
 */
function matches(packingList, filename) {
  try {
    if (!packingList || packingList.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    // check for correct establishment number
    if (!regex.test(headers.ASDA4.establishmentNumber.regex, packingList)) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(
      Object.values(headers.ASDA4.regex),
      packingList,
    );

    if (result === matcherResult.WRONG_HEADER) {
      return result;
    }

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches Asda Model 4 CSV with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
