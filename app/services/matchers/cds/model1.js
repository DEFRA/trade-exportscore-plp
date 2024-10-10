const matcher_result = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  try {
    let result;
    const sheets = Object.keys(packingList);
    if (sheets.length === 0) {
      throw new Error("generic error");
    }
    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        !regex.test(headers.CDS1.establishmentNumber.regex, packingList[sheet])
      ) {
        return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
      }
      // check for header values
      result = matchesHeader(headers.CDS1.regex, packingList[sheet]);
    }
    if (result === matcher_result.CORRECT) {
      logger.log_info(
        "app/services/matchers/cds/model1.js",
        "matches()",
        `Packing list matches cds Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.logError("app/services/matchers/cds/model1.js", "matches()", err);
    return matcher_result.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
