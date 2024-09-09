const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");

function matches(packingList, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }
    const sheet = Object.keys(packingList)[0];
    const establishmentNumberRow = packingList[sheet].findIndex(
      (x) => x.A === "NIRMS NUMBER",
    );

    // check for correct establishment number
    const establishmentNumber =
      packingList[sheet][establishmentNumberRow + 1].A;
    if (!establishmentNumber.startsWith("RMS-GB-000153")) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "DESCRIPTION",
      G: "Quantity",
      H: "Net Weight (KG)",
      E: "Commodity Code",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Giovanni Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.C === "DESCRIPTION";
}

module.exports = {
  matches,
};
