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
      A: "Delivery Date",
      B: "Load Ref\r\n(Trailer Number)",
      C: "Product Type / Category",
      D: "Product / Part Number",
      E: "Product / Part Number Description",
      F: "Packed Singles",
      G: "Packages",
      H: "Net\r\nWeight / Package KG",
      I: "Gross\r\nWeight / Package KG",
      J: "Packaging Type",
      K: "Excise Code",
      L: "Final Destination ID",
      M: "Dispatch Unit ID",
      N: "RMS Number (based on depot)",
      O: "Commodity Code",
    };

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    } else {
      return MatcherResult.CORRECT;
    }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
