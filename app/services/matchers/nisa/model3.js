const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");

function matches(packingList) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000025-/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      C: "PRODUCT TYPE CATEGORY",
      E: "PART NUMBER DESCRIPTION",
      F: "TARIFF CODE EU",
      G: "PACKAGES",
      I: "NET WEIGHT TOTAL",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.E === "PART NUMBER DESCRIPTION";
}

module.exports = { matches };
