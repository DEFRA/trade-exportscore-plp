const matcherResult = require("../../matcher-result");
const regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];
    if (sheet === undefined) {
      return matcherResult.EMPTY_FILE;
    }

    if (Object.values(packingList)[0].length < 2) {
      return matcherResult.VALID_HEADERS_NO_DATA;
    }

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
    if (!packingList[sheet][headerRow] || headerRow === -1) {
      return matcherResult.WRONG_HEADER;
    }

    for (const key in header) {
      if (!packingList[sheet][headerRow][key]?.startsWith(header[key])) {
        return matcherResult.WRONG_HEADER;
      }
    }

    logger.log_info(
      "app/services/matchers/tjmorris/model1.js",
      "matches()",
      `Packing list matches tjmorris Model 1 with filename: ${filename}`,
    );
    return matcherResult.CORRECT;
  } catch (err) {
    logger.log_error(
      "app/services/matchers/tjmorris/model1.js",
      "matches()",
      err,
    );
    return matcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.L === "Description";
}

module.exports = {
  matches,
};
