const matcher_result = require("../../matcher-result");
const { rowFinder } = require("../../../utilities/row-finder");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matchesModel(packingList, filename, regex_expression, trader) {
  let headerRow = 0;

  try {
    //check for correct establishment number
    const sheets = Object.keys(packingList);

    if (sheets.length === 0) {
      throw new Error("generic error");
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (!regex.test(regex_expression, packingList[sheet])) {
        return matcher_result.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      headerRow = rowFinder(packingList[sheet], callback);
      if (headerRow === -1) {
        return matcher_result.WRONG_HEADER;
      }
      if (!areHeadersValid(packingList, sheet, headerRow)) {
        return matcher_result.WRONG_HEADER;
      }
    }

    logger.log_info(
      "app/services/matchers/fowlerwelch/model1.js",
      "matches()",
      `Packing list matches fowlerwelch Model 1 with filename: ${filename}`,
    );
    return matcher_result.CORRECT;
  } catch (err) {
    logger.log_error(
      "app/services/matchers/fowlerwelch/model1.js",
      "matches()",
      err,
    );
    return matcher_result.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.F === "Description of goods";
}

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    headers.FOWLERWELCH1.establishmentNumber.regex,
    "Fowler Welch",
  );
}

function areHeadersValid(packingList, sheet, headerRow) {
  const headers = {
    C: "Commodity code",
    F: "Description of goods",
    H: "No. of pkgs",
    K: "Item Net Weight (kgs)",
    N: "Treatment Type (Chilled /Ambient)",
  };

  for (const key in headers) {
    const cellValue = packingList[sheet][headerRow][key].toLowerCase();

    if (key === "K") {
      if (!cellValue.includes("net weight")) {
        return false; // Return false if the "K" key doesn't match "net weight"
      }
    } else {
      if (!cellValue.startsWith(headers[key].toLowerCase())) {
        return false; // Return false if any other key doesn't start with the correct header
      }
    }
  }

  return true; // Return true if all headers match
}

module.exports = { matches, matchesModel };
