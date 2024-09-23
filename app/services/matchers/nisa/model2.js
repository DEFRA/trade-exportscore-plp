const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (
      !Regex.test(headers.NISA2.establishmentNumber.regex, packingList[sheet])
    ) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const result = matchesHeader(headers.NISA2.regex, packingList[sheet]);

    if (result === MatcherResult.CORRECT) {
      logger.log_info(
        "services > matchers > nisa > model2.js",
        "matches()",
        `Packing list matches nisa Model 2 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.log_error(
      "services > matchers > nisa > model2.js",
      "matches()",
      err,
    );
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
