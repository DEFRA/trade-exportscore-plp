const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingListJson, filename) {
  try {
    const sheet = Object.keys(packingListJson)[0];

    // check for correct establishment number
    const establishmentNumber = packingListJson[sheet][0].B;
    const regex = /^RMS-GB-000098-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Commodity code",
      B: "Description of goods",
      D: "No. of pkgs",
      G: "Item Net Weight (kgs)",
      H: "Treatment Type (Chilled /Ambient)",
    };

    const result = matchesHeader(header, packingListJson[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Buffaload Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.B === "Description of goods";
}

module.exports = {
  matches,
};
