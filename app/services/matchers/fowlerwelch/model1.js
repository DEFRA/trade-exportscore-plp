const matcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function matchesModel(packingList, filename, regexExpression, trader) {
  try {
    let result;
    const sheets = Object.keys(packingList);
    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      if (!headers.FOWLERWELCH1.invalidSheets.includes(sheet)) {
        // check for correct establishment number
        if (!regex.test(regexExpression, packingList[sheet])) {
          return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
        }
        // check for header values
        result = matchesHeader(headers.FOWLERWELCH1.regex, packingList[sheet]);
      }
    }
    if (result === matcherResult.CORRECT) {
      logger.log_info(
        filenameForLogging,
        "matches()",
        `Packing list matches fowlerwelch Model 1 with filename: ${filename}`,
      );
    }
    return result;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.FOWLERWELCH1.establishmentNumber.regex,
    "Fowler Welch",
  );
}

module.exports = { matches, matchesModel };
