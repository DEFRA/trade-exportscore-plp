const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");

function matches(packingList) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000323/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "Commodity Code",
      F: "Description of Goods",
      H: "No. of Pkgs",
      K: "Total Net Weight",
    };

    // Check if packing list CONTAINS expected header
    const result = matchesHeader(header, packingList[sheet], callback);

    return result;
  } catch (err) {
    console.error(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.F === "Description of Goods";
}

module.exports = {
  matches,
};
