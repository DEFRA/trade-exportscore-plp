const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];
    if (sheet === undefined) {
      return matcherResult.EMPTY_FILE;
    }

    if (Object.values(packingList)[0].length < 2) {
      return matcherResult.VALID_HEADERS_NO_DATA;
    }

    // check for correct establishment number
    if (
      !regex.test(headers.NISA1.establishmentNumber.regex, packingList[sheet])
    ) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const result = matchesHeader(headers.NISA1.regex, packingList[sheet]);

    if (result === matcherResult.CORRECT) {
      logger.log_info(
        "app/services/matchers/nisa/model1.js",
        "matches()",
        `Packing list matches nisa Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.log_error("app/services/matchers/nisa/model1.js", "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
