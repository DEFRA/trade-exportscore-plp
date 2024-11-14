const matcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);
const { matchesHeader } = require("../../matches-header");

function matchesModel(packingList, filename, regexExpression) {
  try {
    let result = matcherResult.EMPTY_FILE; // Initialise to EMPTY_FILE as spreadsheet with only invalid sheets is equivalent to an empty file.
    const sheets = Object.keys(packingList);
    if (!sheets?.length) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // Skip invalid sheets
      if (headers.FOWLERWELCH1.invalidSheets.includes(sheet)) {
        continue;
      }

      // Check for correct establishment number
      if (!regex.test(regexExpression, packingList[sheet])) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // Check for header values
      result = matchesHeader(
        Object.values(headers.FOWLERWELCH1.regex),
        packingList[sheet],
      );
      if (result === matcherResult.WRONG_HEADER) {
        return result;
      }
    }

    logger.logInfo(
      filenameForLogging,
      "matches()",
      `Packing list matches fowlerwelch Model 1 with filename: ${filename}`,
    );

    return result; // Return the last checked result if no issues were found
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
  );
}

module.exports = { matches, matchesModel };
