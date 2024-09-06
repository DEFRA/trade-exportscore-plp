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
    const establishmentNumberRow =
      packingList[sheet].findIndex((x) => x.A === "NIRMS NUMBER") + 1;
    const establishmentNumber =
      packingList[sheet][establishmentNumberRow].A ?? [];

    if (!establishmentNumber.startsWith("RMS-GB-000133")) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values

    const header = {
      C: "DESCRIPTION",
      E: "Commodity Code",
      G: "Quantity",
      H: "Net Weight (KG)",
    };
    function callback(x) {
      return x.C === "DESCRIPTION";
    }

    const headerRow = rowFinder(packingList[sheet], callback);
    if (headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }
    const result = matchesHeader(header, packingList[sheet][headerRow]);
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Nutricia Model 1 with filename: ",
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
