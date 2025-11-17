/**
 * Davenport matcher (model 2)
 *
 * Matches the Davenport packing list layout by checking establishment
 * number patterns and expected header fields.
 */
const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Check whether the provided packing list matches Davenport Model 2.
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} - One of matcherResult codes
 */
function matches(packingList, filename) {
  try {
    let result = matcherResult.EMPTY_FILE; // Initialise to EMPTY_FILE as spreadsheet with only invalid sheets is equivalent to an empty file.
    const sheets = Object.keys(packingList);
    if (!sheets?.length) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // Skip invalid sheets
      if (headers.DAVENPORT2.invalidSheets.includes(sheet)) {
        continue;
      }

      // check for correct establishment number
      if (
        !regex.test(
          headers.DAVENPORT2.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }
      // check for header values
      result = matchesHeader(
        Object.values(headers.DAVENPORT2.regex),
        packingList[sheet],
      );
      if (result === matcherResult.WRONG_HEADER) {
        return result;
      }
    }

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches davenport Model 2 with filename: ${filename}`,
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
