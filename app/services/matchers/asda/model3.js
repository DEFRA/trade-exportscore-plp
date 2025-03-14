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

    let establishmentFound = false;
    let columnsMatch = true;
    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        establishmentFound || regex.test(headers.ASDA3.establishmentNumber.regex, packingList[sheet])
      ) {
        establishmentFound = true;
      }

      // check for header values
      columnsMatch = columnsMatch && headers.ASDA3.regex.some((possibleHeader) => {
        return matchesHeader(
          Object.values(possibleHeader),
          packingList[sheet],
        ) !== matcherResult.WRONG_HEADER;
      });
    }

    if (!establishmentFound) {
      result = matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    } else if (!columnsMatch) {
      result = matcherResult.WRONG_HEADER;
    } else {
      result = matcherResult.CORRECT;
    }

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
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
