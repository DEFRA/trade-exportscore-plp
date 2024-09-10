const MatcherResult = require("../../../matches-result");
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
      K: "PART_NUMBER_DESCRIPTION",
      L: "TARIFF_CODE_EU",
      M: "PACKAGES",
      O: "NET_WEIGHT_TOTAL",
      I: "PRODUCT_TYPE_CATEGORY",
    };

    const result = matchesHeader(header, packingList[sheet], callback);

    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Nisa Model 1 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function callback(x) {
  return x.K === "PART_NUMBER_DESCRIPTION";
}

module.exports = { matches };
