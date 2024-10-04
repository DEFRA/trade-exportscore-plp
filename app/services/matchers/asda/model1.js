const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");
const headers = require("../../model-headers");

function matches(packingList, filename) {
  try {
    let result;
    const sheets = Object.keys(packingList);
    if (sheets.length === 0) {
      throw new Error("generic error");
    }

    for (const sheet of sheets) {
      // check for correct establishment number
      if (
        !Regex.test(headers.ASDA1.establishmentNumber.regex, packingList[sheet])
      ) {
        return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }
      // check for header values
      result = matchesHeader(headers.ASDA1.regex, packingList[sheet]);
    }
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Asda Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    console.log(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
