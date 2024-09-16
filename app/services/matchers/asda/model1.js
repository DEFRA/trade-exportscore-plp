const MatcherResult = require("../../matcher-result");
const { matchesHeader } = require("../../matches-header");
const Regex = require("../../../utilities/regex");

function matches(packingList, filename) {
  try {
    console.log(
      "Object.keys(packingList).length: ",
      Object.keys(packingList).length,
    );
    if (Object.keys(packingList).length === 0) {
      console.log("ASDA MODEL 1: ", sheet);
      console.log("ASDA MODEL 1 length: ", sheet.length);
      console.log("packingListJson.length: ", packingList.length);
      console.log("1 filename: ", filename);
    }
    const sheet = Object.keys(packingList)[0];
    if (sheet.length < 5) {
      console.log("ASDA MODEL 1: ", sheet);
      console.log("ASDA MODEL 1 length: ", sheet.length);
      console.log("packingListJson.length: ", packingList.length);
      console.log("2 filename: ", filename);
      return MatcherResult.EMPTY_FILE;
    }

    // check for header values
    const header = {
      A: "[Description Of All Retail Goods]",
      B: "[Nature Of Product]",
      C: "[Treatment Type]",
      F: "[Number of Packages]",
      G: "[Net Weight]",
    };

    // check for correct establishment number
    const regex = /RMS-GB-000015-/;
    if (!Regex.test(regex, packingList[sheet])) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Asda Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.A === "[Description Of All Retail Goods]";
}

module.exports = {
  matches,
};
