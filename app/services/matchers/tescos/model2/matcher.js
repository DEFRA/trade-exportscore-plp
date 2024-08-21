const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

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
      C: "Commodity code",
      F: "Description of goods",
      H: "No. of pkgs",
      K: "Total Net Weight",
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
