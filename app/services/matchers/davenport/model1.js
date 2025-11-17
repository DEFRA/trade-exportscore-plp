/**
 * Davenport matcher (model 1)
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
 * Davenport matcher (model 1)
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} matcherResult - One of the matcher result codes
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
      if (headers.DAVENPORT1.invalidSheets.includes(sheet)) {
        continue;
      }

      // check for correct establishment number
      if (
        !regex.test(
          headers.DAVENPORT1.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }
      // check for header values
      result = matchesHeader(
        Object.values(headers.DAVENPORT1.regex),
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
        `Packing list matches davenport Model 1 with filename: ${filename}`,
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
