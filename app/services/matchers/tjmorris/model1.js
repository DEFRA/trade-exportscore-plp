const matcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function matches(packingList, filename) {
  try {
    const sheets = Object.keys(packingList);
    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        !regex.test(
          headers.TJMORRIS1.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      const header = {
        J: "TREATMENTTYPE",
        L: "Description",
        N: "Description",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      };

      const headerRow = rowFinder(packingList[sheet], callback);

      if (
        !packingList[sheet][headerRow] ||
        headerRow === -1 ||
        !isHeaderMatching(packingList[sheet], header, headerRow)
      ) {
        return matcherResult.WRONG_HEADER;
      }
    }

    logger.log_info(
      filenameForLogging,
      "matches()",
      `Packing list matches tjmorris Model 1 with filename: ${filename}`,
    );

    return matcherResult.CORRECT;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.L === "Description";
}

function isHeaderMatching(packingListSheet, header, headerRow) {
  for (const key in header) {
    if (!packingListSheet[headerRow][key]?.startsWith(header[key])) {
      return false;
    }
  }
  return true;
}

module.exports = {
  matches,
};
