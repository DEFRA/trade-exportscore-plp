const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xls") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1].H;
    const regex = /^RMS-GB-000015-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      B: "[Description Of All Retail Go",
      D: "[Nature Of Product]",
      F: "[Treatment Ty",
      H: "Establishment Number",
      J: "Cases",
      L: "Case Weight",
      N: "NET Weight",
    };

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    }

    console.info("Packing list matches Asda Model 2 with filename: ", filename);
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
