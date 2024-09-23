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
      !Regex.test(
        headers.DAVENPORT1.establishmentNumber.regex,
        packingList[sheet],
      )
    ) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(headers.DAVENPORT1.regex, packingList[sheet]);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Davenport Model 1 with filename: ",
        filename,
      );
    }

    return result;
  } catch (err) {
    logger.log_error(
      "services > matchers > davenport > model1.js",
      "matches()",
      err,
    );
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
