const MatcherResult = require("../../../matcher-result");
const { matchesHeader } = require("../../../matches-header");
const Regex = require("../../../../utilities/regex");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000098-/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Commodity code",
      B: "Description of goods",
      D: "No. of pkgs",
      G: "Item Net Weight (kgs)",
      H: "Treatment Type (Chilled /Ambient)",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Buffaload Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.B === "Description of goods";
}

module.exports = {
  matches,
};
