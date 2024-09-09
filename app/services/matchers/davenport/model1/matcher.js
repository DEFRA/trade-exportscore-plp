const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");
const { rowFinder } = require("../../../../utilities/row-finder");

function matches(packingList, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingList)[0];
    // check for correct establishment number
    const establishmentNumberRow = 18;
    const establishmentNumber =
      packingList[sheet][establishmentNumberRow].C ?? [];

    const regex = /^RMS-GB-000323-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "Commodity Code",
      F: "Description of Goods",
      H: "No. of Pkgs",
      K: "Total Net Weight",
    };

    // Check if packing list CONTAINS expected header
    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches davenport 1 with filename: ",
        filename,
      );
    }

    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.F === "Description of Goods";
}

module.exports = {
  matches,
};
