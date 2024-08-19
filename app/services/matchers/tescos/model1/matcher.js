const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

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
      AT: "Green Lane",
      BR: "Packages",
      BT: "Gross Weight",
      BU: "Net Weight",
    };

    for (const key in header) {
      if (
        !packingListJson[INPUT_DATA_SHEET][4] ||
        packingListJson[INPUT_DATA_SHEET][4][key] !== header[key]
      ) {
        return MatcherResult.WRONG_HEADER;
      }
    }

    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
