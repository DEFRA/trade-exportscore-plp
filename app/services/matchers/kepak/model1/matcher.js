const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingList, filename) {
  try {
    const sheet = Object.keys(packingList)[0];
    // check for correct establishment number
    const establishmentNumberRow = 12;
    const establishmentNumber =
      packingList[sheet][establishmentNumberRow].A ?? [];

    if (!establishmentNumber.startsWith("RMS-GB-000280")) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }
    // check for header values
    const headerRow = 20;
    const header = {
      C: "DESCRIPTION",
      E: "Commodity Code",
      G: "Quantity",
      H: "Net Weight (KG)",
    };

    const result = matchesHeader(header, packingList[sheet][headerRow]);
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Kepak Model 1 with filename: ",
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
