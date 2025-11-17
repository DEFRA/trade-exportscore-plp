/**
 * TJ Morris matcher (model 2)
 *
 * Alternate TJ Morris matcher handling a different sheet layout.
 */
const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("node:path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

/**
 * TJ Morris matcher (model 2)
 * @param {Object} packingList - Excel->JSON representation keyed by sheet
 * @param {string} filename - Source filename for logging
 * @returns {string} matcherResult - One of the matcher result codes
 */
function matches(packingList, filename) {
  try {
    let result;
    const sheets = Object.keys(packingList);
    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        !regex.test(
          headers.TJMORRIS2.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      result = matchesHeader(
        Object.values(headers.TJMORRIS2.regex),
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
        `Packing list matches Tjmorris Model 2 with filename: ${filename}`,
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
