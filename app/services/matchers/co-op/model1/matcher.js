const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");
const { rowFinder } = require("../../../../utilities/row-finder");
function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingList)[0];

    const establishmentNumber = packingList[sheet][establishmentNumberRow].E;
    const regex = /^RMS-GB-000009-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      O: "Product/ Part Number description",
      P: "Tariff Code EU",
      Q: "Packages",
      S: "NW total",
    };

    function callback(x) {
      return x.O === "Product/ Part Number description";
    }

    const headerRow = rowFinder(packingList[sheet], callback);
    if (headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }
    const result = matchesHeader(header, packingList[sheet][headerRow]);
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Co-op Model 1 with filename: ",
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
