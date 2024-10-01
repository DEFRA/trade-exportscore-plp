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

    if (Object.values(packingList)[0].length < 4) {
      return matcherResult.VALID_HEADERS_NO_DATA;
    }

    // check for correct establishment number
    if (
      !regex.test(headers.NISA2.establishmentNumber.regex, packingList[sheet])
    ) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const result = matchesHeader(headers.NISA2.regex, packingList[sheet]);

    if (result === matcherResult.CORRECT) {
      logger.log_info(
        "app/services/matchers/nisa/model2.js",
        "matches()",
        `Packing list matches nisa Model 2 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.log_error("app/services/matchers/nisa/model2.js", "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
