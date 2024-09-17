const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");

function matches(packingList) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000252/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      D: "Product",
      E: "# Packages",
      H: "NetWeight",
      I: "NatureOfProduct",
      J: "Treatment",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    return result;
  } catch (err) {
    console.error(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.D === "Product";
}

module.exports = {
  matches,
};
