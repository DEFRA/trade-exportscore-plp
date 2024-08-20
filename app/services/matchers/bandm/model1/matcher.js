const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

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
    const headerRow = packingListJson.Sheet1.findIndex((x) => x.B === "PRISM");
    const header = {
      A: "PRODUCT CODE (SHORT)",
      B: "PRISM",
      C: "ITEM DESCRIPTION",
      D: "COMMODITY CODE",
      E: "PLACE OF DISPATCH",
      F: "TOTAL NUMBER OF CASES",
      G: "NET WEIGHT",
      H: "GROSS WEIGHT",
      I: "ANIMAL ORIGIN",
    };
    if (
      JSON.stringify(packingListJson.Sheet1[headerRow]) !==
      JSON.stringify(header)
    ) {
      return MatcherResult.WRONG_HEADER;
    }

    console.info("Packing list matches BandM with filename: ", filename);
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
