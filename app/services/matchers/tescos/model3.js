const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");
const headers = require("../../model-headers");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (
      !Regex.test(headers.TESCO3.establishmentNumber.regex, packingList[sheet])
    ) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const result = matchesHeader(headers.TESCO3.regex, packingList[sheet]);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Tesco Model 3 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.A === "Product/ Part Number description";
}

module.exports = {
  matches,
};
