const MatcherResult = require("../../../matcher-result");
const { matchesHeader } = require("../../../matches-header");
const Regex = require("../../../../utilities/regex");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000022-/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      G: "Product/ Part Number description",
      L: "Tariff Code UK",
      AS: "Treatment Type",
      BR: "Packages",
      BU: "Net Weight",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Tesco Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.G === "Product/ Part Number description";
}

module.exports = {
  matches,
};
