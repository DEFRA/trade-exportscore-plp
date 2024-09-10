const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingListJson, filename) {
  try {
    const sheet = Object.keys(packingListJson)[0];

    // check for correct establishment number
    const establishmentNumber = packingListJson[sheet][1]?.N.replace(
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

    const result = matchesHeader(header, packingListJson[sheet], callback);

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

function callback(x) {
  return x.E === "Product / Part Number Description";
}

module.exports = {
  matches,
};
