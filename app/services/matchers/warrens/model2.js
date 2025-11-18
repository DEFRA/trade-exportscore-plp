/**
 * Warrens matcher (model 2)
 *
 * Alternate Warrens matcher variant which validates header rows.
 */
const matcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { matchesHeader } = require("../../matches-header");

/**
 * Warrens matcher helper for model 2.
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @param {RegExp} regexExpression - Establishment number regex for the model
 * @returns {string} matcherResult - One of the matcher result codes
 */
function matchesModel(packingList, filename, regexExpression) {
  try {
    let result = matcherResult.EMPTY_FILE; // Initialise to EMPTY_FILE as spreadsheet with only invalid sheets is equivalent to an empty file.
    const sheets = Object.keys(packingList);
    if (!sheets?.length) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // Skip invalid sheets - may not be needed here?
      if (headers.WARRENS2.invalidSheets.includes(sheet)) {
        continue;
      }

      // Check for correct establishment number
      if (!regex.test(regexExpression, packingList[sheet])) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // Check for header values
      result = matchesHeader(
        Object.values(headers.WARRENS2.regex),
        packingList[sheet],
      );
      if (result === matcherResult.WRONG_HEADER) {
        return result;
      }
    }

    logger.logInfo(
      filenameForLogging,
      "matches()",
      `Packing list matches Warrens 2 with filename: ${filename}`,
    );

    return result; // Return the last checked result if no issues were found
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

/**
 * Check whether the provided packing list matches Warrens Model 2.
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} - One of matcherResult codes
 */
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.WARRENS2.establishmentNumber.regex,
  );
}

module.exports = { matches, matchesModel };
