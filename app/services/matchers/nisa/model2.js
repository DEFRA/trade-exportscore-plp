const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");
const headers = require("../../model-headers");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];

    // check for correct establishment number
    if (
      !Regex.test(headers.NISA2.establishmentNumber.regex, packingList[sheet])
    ) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const result = matchesHeader(headers.NISA2.regex, packingList[sheet]);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Nisa Model 2 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
