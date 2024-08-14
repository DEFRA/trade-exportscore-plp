const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

const COUNTRY_OF_ORIGIN = "Country of Origin";

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet2[2].M;
    const regex = /^RMS-GB-000015-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Item",
      B: "Product code",
      C: "Commodity code",
      D: "Online Check",
      E: "Meursing code",
      F: "Description of goods",
      G: COUNTRY_OF_ORIGIN,
      H: "No. of pkgs",
      I: "Type of pkgs",
      J: "Total Gross Weight",
      K: "Total Net Weight",
      L: "Total Line Value",
      M: "GB Establishment RMS Number",
    };

    if (JSON.stringify(packingListJson.Sheet2[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    } else {
      return MatcherResult.CORRECT;
    }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
