const matcher_result = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (
      !regex.test(headers.BANDM1.establishmentNumber.regex, packingList[sheet])
    ) {
      return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(headers.BANDM1.regex, packingList[sheet]);

    if (result === matcher_result.CORRECT) {
      logger.log_info(
        "services > matchers > bandm > model1.js",
        "matches()",
        `Packing list matches bandm Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.log_error(
      "services > matchers > bandm > model1.js",
      "matches()",
      err,
    );
    return matcher_result.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
