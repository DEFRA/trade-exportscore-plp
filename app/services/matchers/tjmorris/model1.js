const MatcherResult = require("../../matcher-result");
const Regex = require("../../../utilities/regex");
const { rowFinder } = require("../../../utilities/row-finder");
const headers = require("../../model-headers");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (
      !Regex.test(
        headers.TJMORRIS1.establishmentNumber.regex,
        packingList[sheet],
      )
    ) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
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
      return MatcherResult.WRONG_HEADER;
    }

    for (const key in header) {
      if (!packingList[sheet][headerRow][key]?.startsWith(header[key])) {
        return MatcherResult.WRONG_HEADER;
      }
    }

    console.info(
      "Packing list matches TJ Morris Model 1 with filename: ",
      filename,
    );
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.L === "Description";
}

module.exports = {
  matches,
};
