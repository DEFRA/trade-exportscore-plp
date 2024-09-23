const MatcherResult = require("../../matcher-result");
const { rowFinder } = require("../../../utilities/row-finder");
const Regex = require("../../../utilities/regex");
const headers = require("../../model-headers");
const logger = require("../../../utilities/logger");

function matchesModel(packingList, filename, regex, trader) {
  let headerRow = 0;

  try {
    //check for correct establishment number
    const sheets = Object.keys(packingList);

    if (sheets.length === 0) {
      throw new Error("generic error");
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (!Regex.test(regex, packingList[sheet])) {
        return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values
      headerRow = rowFinder(packingList[sheet], callback);
      if (headerRow === -1) {
        return MatcherResult.WRONG_HEADER;
      }
      const header = {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      };

      for (const key in header) {
        if (
          (key === "K" &&
            !packingList[sheet][headerRow][key]
              .toLowerCase()
              .includes("net weight")) ||
          (key !== "K" &&
            !packingList[sheet][headerRow][key]
              .toLowerCase()
              .startsWith(header[key].toLowerCase()))
        ) {
          return MatcherResult.WRONG_HEADER;
        }
      }
    }

    logger.log_info(
      "services > matchers > fowlerwelch > model1.js",
      "matches()",
      `Packing list matches fowlerwelch Model 1 with filename: ${filename}`,
    );
    return MatcherResult.CORRECT;
  } catch (err) {
    logger.log_error(
      "services > matchers > fowlerwelch > model1.js",
      "matches()",
      err,
    );
    return MatcherResult.GENERIC_ERROR;
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

module.exports = { matches, matchesModel };
