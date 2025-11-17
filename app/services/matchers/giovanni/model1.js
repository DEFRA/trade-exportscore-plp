/**
 * Giovanni matcher (model 1)
 *
 * Detects Giovanni-style PDF packing lists by analysing headers and
 * checking establishment number patterns.
 */
const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * Giovanni matcher helper for model 1.
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @param {RegExp} regexExpression - Establishment number regex for the model
 * @returns {string} matcherResult - One of the matcher result codes
 */
function matchesModel(packingList, filename, regexExpression) {
  try {
    let result;
    const sheets = Object.keys(packingList);
    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (!regex.test(regexExpression, packingList[sheet])) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      result = matchesHeader(
        Object.values(headers.GIOVANNI1.regex),
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
        `Packing list matches giovanni Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

/**
 * Check whether the provided packing list matches Giovanni Model 1.
 * @param {Object} packingList - PDF buffer or JSON representation
 * @param {string} filename - Source filename for logging
 * @returns {Promise<string>} - One of matcherResult codes
 */
function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.GIOVANNI1.establishmentNumber.regex,
  );
}

module.exports = {
  matches,
  matchesModel,
};
