const matcherResult = require("./matcher-result");
const regex = require("../utilities/regex");
const logger = require("../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

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
