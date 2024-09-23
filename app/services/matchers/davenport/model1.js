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
      !regex.test(
        headers.DAVENPORT1.establishmentNumber.regex,
        packingList[sheet],
      )
    ) {
      return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(headers.DAVENPORT1.regex, packingList[sheet]);

    if (result === matcher_result.CORRECT) {
      logger.log_info(
        "services > matchers > davenport > model1.js",
        "matches()",
        `Packing list matches davenport Model 1 with filename: ${filename}`,
      );
    }

    return result;
  } catch (err) {
    logger.log_error(
      "services > matchers > davenport > model1.js",
      "matches()",
      err,
    );
    return matcher_result.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
