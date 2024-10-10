const matcherResult = require("../../matcher-result");
const { rowFinder } = require("../../../utilities/row-finder");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

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
        return matcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      headerRow = rowFinder(packingList[sheet], callback);
      if (headerRow === -1) {
        return matcherResult.WRONG_HEADER;
      }
      if (!areHeadersValid(packingList, sheet, headerRow)) {
        return matcherResult.WRONG_HEADER;
      }
    }

    logger.log_info(
      filenameForLogging,
      "matches()",
      `Packing list matches fowlerwelch Model 1 with filename: ${filename}`,
    );
    return matcherResult.CORRECT;
  } catch (err) {
    logger.logError(filenameForLogging, "matches()", err);
    return matcherResult.GENERIC_ERROR;
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
  const validHeaders = {
    C: headers.FOWLERWELCH1.headers.commodity_code,
    F: headers.FOWLERWELCH1.headers.description,
    H: headers.FOWLERWELCH1.headers.number_of_packages,
    K: headers.FOWLERWELCH1.headers.total_net_weight_kg,
    N: "Treatment Type (Chilled /Ambient)",
  };

  for (const key in validHeaders) {
    if (!validHeaders.hasOwnProperty(key)) {
      continue; // Skip if it's not the object's own property
    }

    const cellValue = packingList[sheet][headerRow][key].toLowerCase();

    if (
      (key === "K" && !cellValue.includes("net weight")) ||
      (key !== "K" && !cellValue.startsWith(validHeaders[key].toLowerCase()))
    ) {
      return false; // Return false if any key doesn't match the expected header
    }
  }

  return true; // Return true if all headers match
}

module.exports = { matches, matchesModel };
