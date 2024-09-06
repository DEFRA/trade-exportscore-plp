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

    function callback(x) {
      return x.F === "Description of Goods";
    }
    const headerRow = rowFinder(packingList[sheet], callback);
    if (headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }

    if (!packingList[sheet][headerRow]) {
      return MatcherResult.WRONG_HEADER;
    }

    // Check if packing list CONTAINS expected header

    for (const key in header) {
      if (packingList[sheet][headerRow][key].indexOf(header[key]) === -1) {
        return MatcherResult.WRONG_HEADER;
      }
    }
    return MatcherResult.CORRECT;
  } catch (err) {
    console.log(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
