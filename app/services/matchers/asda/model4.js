const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers-csv");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function matches(packingList, filename) {
  try {
    let result;

    if (!packingList || packingList.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    // check for correct establishment number
    if (!regex.test(headers.ASDA4.establishmentNumber.regex, packingList)) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    result = matchesHeader(Object.values(headers.ASDA4.regex), packingList);

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
