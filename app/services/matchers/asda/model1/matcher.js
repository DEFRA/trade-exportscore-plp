const MatcherResult = require("../../../matches-result");

function matches(packingListJson, filename) {
  try {
    // check for correct extension
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "xls") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber =
      packingListJson.PackingList_Extract[1].D ?? null;
    const regex = /^RMS-GB-000015-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "[Description Of All Retail Goods]",
      B: "[Nature Of Product]",
      C: "[Treatment Type]",
      D: "[Number Of Establishment]",
      E: "[Destination Store Establishment Number]",
      F: "[Number of Packages]",
      G: "[Net Weight]",
      H: "[kilograms/grams]",
    };

    if (
      JSON.stringify(packingListJson.PackingList_Extract[0]) !==
      JSON.stringify(header)
    ) {
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
