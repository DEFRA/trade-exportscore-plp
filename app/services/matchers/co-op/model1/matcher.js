const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

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
      E: "Dispatch RMS Establishment",
      O: "Product/ Part Number description",
      P: "Tariff Code EU",
      Q: "Packages",
      S: "NW total",
    };

    for (const key in header) {
      if (
        !packingList[sheet][0] ||
        packingList[sheet][0][key] !== header[key]
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
