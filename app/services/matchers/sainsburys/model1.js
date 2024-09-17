const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");

function matches(packingList) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    const regex = /RMS-GB-000094-/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "Product Type / Category",
      E: "Product / Part Number Description",
      G: "Packages",
      H: "Net\nWeight / Package KG",
      J: "Packaging Type",
      O: "Commodity Code",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    return result;
  } catch (err) {
    console.error(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.E === "Product / Part Number Description";
}

module.exports = {
  matches,
};
