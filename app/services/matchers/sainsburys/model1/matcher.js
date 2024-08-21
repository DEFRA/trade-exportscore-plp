const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.N.replace(
      /\u200B/g,
      "",
    );
    const regex = /^RMS-GB-000094-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      C: "Product Type / Category",
      E: "Product / Part Number Description",
      G: "Packages",
      H: "Net\r\nWeight / Package KG",
      J: "Packaging Type",
      O: "Commodity Code",
    };

    for (const key in header) {
      if (
        !packingList.Sheet1[0] ||
        packingList.Sheet1[0][key] !== header[key]
      ) {
        console.log(packingList.Sheet1[0][key])
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
