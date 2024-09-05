const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");

const INPUT_DATA_SHEET = "Input Data Sheet";

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }
    const establishmentNumberRow = 3;
    // check for correct establishment number
    const establishmentNumber =
      packingListJson[INPUT_DATA_SHEET][establishmentNumberRow].E;
    const regex = /^RMS-GB-000022-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Product/ Part Number description",
      B: "Tariff Code UK",
      E: "Packages",
      G: "Net Weight",
    };
    const headerRow = 4;
    const result = matchesHeader(
      header,
      packingListJson[INPUT_DATA_SHEET][headerRow],
    );
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

module.exports = {
  matches,
};
