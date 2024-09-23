const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matchesModel(packingList, filename, regex, trader) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(headers.GIOVANNI1.regex, packingList[sheet]);

    if (result === MatcherResult.CORRECT) {
      logger.log_info(
        "services > matchers > giovanni > model1.js",
        "matches()",
        `Packing list matches giovanni Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.log_error(
      "services > matchers > giovanni > model1.js",
      "matches()",
      err,
    );
    return MatcherResult.GENERIC_ERROR;
  }
}

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.GIOVANNI1.establishmentNumber.regex,
    "Giovanni Model 1",
  );
}

module.exports = {
  matches,
  matchesModel,
};
