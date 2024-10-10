const matcher_result = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const { start } = require("applicationinsights");

function matches(packingList, filename) {
  try {
    const sheets = Object.keys(packingList);
    if (sheets.length === 0) {
      throw new Error("generic error");
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        !regex.test(
          headers.TJMORRIS1.establishmentNumber.regex,
          packingList[sheet],
        )
      ) {
        return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
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
        return matcher_result.WRONG_HEADER;
      }
    }
    logger.log_info(
      "app/services/matchers/tjmorris/model1.js",
      "matches()",
      `Packing list matches tjmorris Model 1 with filename: ${filename}`,
    );
    return matcher_result.CORRECT;
  } catch (err) {
    logger.logError(
      "app/services/matchers/tjmorris/model1.js",
      "matches()",
      err,
    );
    return matcher_result.GENERIC_ERROR;
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
