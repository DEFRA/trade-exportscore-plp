const MatcherResult = require("../../../matches-result");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingList)[0];
    const establishmentNumber = packingList[sheet][establishmentNumberRow].A;
    const regex = /^RMS-GB-000025-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      C: "PRODUCT_TYPE_CATEGORY",
      E: "PART_NUMBER_DESCRIPTION",
      F: "TARIFF_CODE_EU",
      G: "PACKAGES",
      H: "NET_WEIGHT_TOTAL"
    };

    for (const key in header) {
      if (
        !packingList[sheet][3] ||
        packingList[sheet][3][key] !== header[key]
      ) {
        return MatcherResult.WRONG_HEADER;
      }
    }

    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
