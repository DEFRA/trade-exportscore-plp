const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    const sheet = Object.keys(packingList)[0];
    // check for correct establishment number
    const placeOfDispatchSplit =
      packingList[sheet][establishmentNumberRow].K?.split("/") ?? [];
    const establishmentNumber =
      placeOfDispatchSplit.length > 1 ? placeOfDispatchSplit[1].trim() : null;

    const regex = /^RMS-GB-000252-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      D: "Product",
      E: "# Packages",
      H: "NetWeight",
      I: "NatureOfProduct",
      J: "Treatment",
    };

    const result = matchesHeader(header, packingList[sheet][0]);
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches CDS Model 1 with filename: ",
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
