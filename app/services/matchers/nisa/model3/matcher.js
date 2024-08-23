const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingList)[0];
    const establishmentNumber = packingList[sheet][establishmentNumberRow].A;
    const regex = /^RMS-GB-000025-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      C: "PRODUCT TYPE CATEGORY",
      E: "PART NUMBER DESCRIPTION",
      F: "TARIFF CODE EU",
      G: "PACKAGES",
      I: "NET WEIGHT TOTAL",
    };

    let result = matchesHeader(header, packingList[sheet][2]);
    if (result === MatcherResult.CORRECT) {
      console.info("Packing list matches Nisa Model 3 with filename: ", filename);
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
