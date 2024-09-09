const MatcherResult = require("../../../matches-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
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

    const result = matchesHeader(header, packingList[sheet][0]);
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
