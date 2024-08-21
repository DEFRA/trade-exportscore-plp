const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

const COUNTRY_OF_ORIGIN = "Country of Origin";
const CUSTOMER_ORDER = "Customer Order";

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }
    const headerRowNumber = 44;
    const establishmentNumberRow = 45;

    // check for correct establishment number
    const establishmentNumber =
      packingListJson[CUSTOMER_ORDER][establishmentNumberRow].M;
    const regex = /^RMS-GB-000216-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "Commodity code",
      F: "Description of goods",
      H: "No. of pkgs ",
      K: "Total Net Weight",
      N: "Treatment Type (Chilled /Ambient)",
    };

    const originalHeader = packingListJson[CUSTOMER_ORDER][headerRowNumber];

    for (const key in header) {
      if (!originalHeader[key].startsWith(header[key])) {
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
