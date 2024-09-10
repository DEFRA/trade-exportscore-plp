const MatcherResult = require("../../../matcher-result");
const { matchesHeader } = require("../../../matches-header");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    const sheet = Object.keys(packingList)[0];
    const establishmentNumber = packingList[sheet][establishmentNumberRow].A;
    const regex = /^RMS-GB-000025-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      C: "PRODUCT TYPE CATEGORY",
      E: "PART NUMBER DESCRIPTION",
      F: "TARIFF CODE EU",
      G: "PACKAGES",
      I: "NET WEIGHT TOTAL",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Nisa Model 3 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.E === "PART NUMBER DESCRIPTION";
}

module.exports = { matches };
