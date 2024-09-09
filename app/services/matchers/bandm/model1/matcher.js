const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingListJson, filename) {
  try {
    // check for correct establishment number
    const traderRow = packingListJson.Sheet1.findIndex(
      (x) => x.H === "WAREHOUSE SCHEME NUMBER:",
    );
    const establishmentNumber = packingListJson.Sheet1[traderRow].I;
    const regex = /^RMS-GB-000005-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const headerRow = packingListJson.Sheet1.findIndex(
      (x) => x.D === "COMMODITY CODE",
    );
    const header = {
      C: "ITEM DESCRIPTION",
      D: "COMMODITY CODE",
      F: "TOTAL NUMBER OF CASES",
      G: "NET WEIGHT",
    };

    const result = matchesHeader(header, packingListJson.Sheet1[headerRow]);
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

module.exports = {
  matches,
};
