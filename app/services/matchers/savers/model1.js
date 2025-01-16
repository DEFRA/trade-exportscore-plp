const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function matches(packingList, filename) {
  try {
    const sheets = Object.keys(packingList);
    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }
    const fristSheet = sheets[0];

    // check for correct establishment number
    if (
      !regex.test(
        headers.SAVERS1.establishmentNumber.regex,
        packingList[fristSheet],
      )
    ) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(
      Object.values(headers.SAVERS1.regex),
      packingList[fristSheet],
    );
    if (result === matcherResult.WRONG_HEADER) {
      return result;
    }

    if (result === matcherResult.CORRECT) {
      logger.logInfo(
        filenameForLogging,
        "matches()",
        `Packing list matches savers Model 1 with filename: ${filename}`,
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
