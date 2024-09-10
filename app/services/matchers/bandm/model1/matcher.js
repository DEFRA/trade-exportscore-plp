const MatcherResult = require("../../../matcher-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingListJson, filename) {
  try {
    const sheet = Object.keys(packingListJson)[0];

    // check for correct establishment number
    const traderRow = packingListJson[sheet].findIndex(
      (x) => x.H === "WAREHOUSE SCHEME NUMBER:",
    );
    const establishmentNumber = packingListJson[sheet][traderRow].I;
    const regex = /^RMS-GB-000005-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values

    const header = {
      C: "ITEM DESCRIPTION",
      D: "COMMODITY CODE",
      F: "TOTAL NUMBER OF CASES",
      G: "NET WEIGHT",
    };

    const result = matchesHeader(header, packingListJson[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches BandM Model 1 with filename: ",
        filename,
      );
    }
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
