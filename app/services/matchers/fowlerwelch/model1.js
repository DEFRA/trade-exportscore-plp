const matcherResult = require("../../matcher-result");
const { rowFinder } = require("../../../utilities/row-finder");
const regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");
const path = require("path");
const filenameForLogging = path.join("app", __filename.split("app")[1]);

function matchesModel(packingList, filename, regexExpression, trader) {
  let headerRow = 0;

  try {
    //check for correct establishment number
    const sheets = Object.keys(packingList);

    if (sheets?.length === 0) {
      return matcherResult.EMPTY_FILE;
    }

    const minimumLengthThatContainsDataForWarrens = 3;
    const minimumLengthThatContainsDataForSingleFowlerWelchSheet = 46;
    let minimumLengthThatContainsData;
    if (trader === "Warrens") {
      minimumLengthThatContainsData = minimumLengthThatContainsDataForWarrens;
    } else if (sheets.length === 1) {
      minimumLengthThatContainsData =
        minimumLengthThatContainsDataForSingleFowlerWelchSheet;
    } else {
      minimumLengthThatContainsData = 2;
    }

    if (Object.values(packingList)[0].length < minimumLengthThatContainsData) {
      return matcherResult.VALID_HEADERS_NO_DATA;
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (!regex.test(regexExpression, packingList[sheet])) {
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
      `Packing list matches ${trader} Model 1 with filename: ${filename}`,
    );
    return matcherResult.CORRECT;
  } catch (err) {
    logger.log_error(filenameForLogging, "matches()", err);
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
    C: "Commodity code",
    F: "Description of goods",
    H: "No. of pkgs",
    K: "Item Net Weight (kgs)",
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
