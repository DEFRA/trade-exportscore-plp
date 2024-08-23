const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");

const INPUT_DATA_SHEET = "Input Data Sheet";

function matches(packingListJson, filename) {
  const establishmentNumberRow = 3;
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber =
      packingListJson[INPUT_DATA_SHEET][establishmentNumberRow].AT;
    const regex = /^RMS-GB-000022-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      G: "Product/ Part Number description",
      L: "Tariff Code UK",
      AS: "Treatment Type",
      BR: "Packages",
      BU: "Net Weight",
    };

    let result = matchesHeader(header, packingListJson[INPUT_DATA_SHEET][4]);
    if (result === MatcherResult.CORRECT) {
      console.info("Packing list matches Tesco Model 1 with filename: ", filename);
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
