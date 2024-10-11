const matcher_result = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

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
        !regex.test(
          headers.BUFFALOAD1.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      result = matchesHeader(headers.BUFFALOAD1.regex, packingList[sheet]);
    }
    if (result === matcher_result.CORRECT) {
      logger.log_info(
        filenameForLogging,
        "matches()",
        `Packing list matches buffaload-logistics Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcher_result.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
