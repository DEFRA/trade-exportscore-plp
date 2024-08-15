const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

const INPUT_DATA_SHEET = "Input Data Sheet";

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson[INPUT_DATA_SHEET][3].E;
    const regex = /^RMS-GB-000022-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Product/ Part Number description",
      B: "Tariff Code UK",
      C: "Treatment Type",
      D: "Green Lane",
      E: "Packages",
      F: "Gross Weight",
      G: "Net Weight",
    };

    for (const key in header) {
      if (
        !packingListJson[INPUT_DATA_SHEET][4] ||
        packingListJson[INPUT_DATA_SHEET][4][key] !== header[key]
      ) {
        return MatcherResult.WRONG_HEADER;
      }
    }

    console.info(
      "Packing list matches Tesco Model 3 with filename: ",
      filename,
    );
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
