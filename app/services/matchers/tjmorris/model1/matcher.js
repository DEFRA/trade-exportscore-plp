const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");
const { rowFinder } = require("../../../../utilities/row-finder");
function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xls") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }
    const sheet = Object.keys(packingListJson)[0];
    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.A;
    const regex = /^RMS-GB-000010-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      J: "TREATMENTTYPE",
      L: "Description",
      N: "Description",
      O: "Tariff/Commodity",
      P: "Cases",
      R: "Net Weight Kg",
    };

    const result = matchesHeader(header, packingListJson[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches TJ Morris Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.L === "Description";
}

module.exports = {
  matches,
};
