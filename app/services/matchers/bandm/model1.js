const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");

function matches(packingList) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000005-/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values

    const header = {
      C: "ITEM DESCRIPTION",
      D: "COMMODITY CODE",
      F: "TOTAL NUMBER OF CASES",
      G: "NET WEIGHT",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.C === "ITEM DESCRIPTION";
}

module.exports = {
  matches,
};
