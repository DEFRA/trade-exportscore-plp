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
      J: "Cases",
      N: "NET Weight",
    };

    for (const key in header) {
      if (
        !packingListJson.Sheet1[0] ||
        packingListJson.Sheet1[0][key] !== header[key]
      ) {
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
