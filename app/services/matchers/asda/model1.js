const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (
      !regex.test(headers.ASDA1.establishmentNumber.regex, packingList[sheet])
    ) {
      return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(headers.ASDA1.regex, packingList[sheet]);

    if (result === matcherResult.CORRECT) {
      logger.log_info(
        "services > matchers > asda > model1.js",
        "matches()",
        `Packing list matches Asda Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.log_error(
      "services > matchers > asda > model1.js",
      "matches()",
      err,
    );

    return matcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
