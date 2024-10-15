const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

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
          headers.TESCO2.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      result = matchesHeader(headers.TESCO2.regex, packingList[sheet]);
    }

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches tescos Model 2 with filename: ${filename}`,
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
