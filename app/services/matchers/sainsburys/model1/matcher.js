const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");
const { rowFinder } = require("../../../../utilities/row-finder");

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingListJson)[0];
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
      H: "Net\nWeight / Package KG",
      J: "Packaging Type",
      O: "Commodity Code",
    };

    function callback(x) {
      return x.G === "Packages";
    }

    const headerRow = rowFinder(packingListJson[sheet], callback);
    if (headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }
    const result = matchesHeader(header, packingListJson[sheet][headerRow]);
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Sainsburys Model 1 with filename: ",
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
