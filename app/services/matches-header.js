/**
 * Header matching utility
 *
 * Tests if packing list sheet rows match expected header patterns using regex.
 * Returns matcher result codes to indicate success or failure reason.
 */
const matcherResult = require("./matcher-result");
const regex = require("../utilities/regex");
const logger = require("../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Check if any row in packing list sheet matches all provided regex patterns.
 * @param {Array<RegExp>} regexHeaders - Array of regex patterns to match
 * @param {Array<Object>} packingListSheet - Packing list sheet rows
 * @returns {number} MatcherResult code (CORRECT, WRONG_HEADER, or GENERIC_ERROR)
 */
function matchesHeader(regexHeaders, packingListSheet) {
  try {
    // Iterate over each row in the packingListSheet
    for (const row of packingListSheet) {
      // Test if ALL regex headers match any of the string properties in the current row object
      if (regex.testAllPatterns(regexHeaders, row)) {
        return matcherResult.CORRECT; // Return CORRECT if at least one object matches all regex
      }
    }

    return matcherResult.WRONG_HEADER; // Return WRONG_HEADER if no object matches all regex patterns
  } catch (err) {
    logger.logError(filenameForLogging, "matchesHeader()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matchesHeader,
};
