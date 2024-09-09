const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingListJson, filename) {
  try {
    // check for correct establishment number
    const establishmentNumber = packingListJson.Tabelle1[0].B;
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

    const result = matchesHeader(header, packingListJson.Tabelle1[1]);
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

module.exports = {
  matches,
};
