const MatcherResult = require("../../services/matches-result");

function matches(packingListJson, filename) {
  const establishmentNumberRow = 1;
  try {
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingListJson)[0];
    const establishmentNumber =
      packingListJson[sheet][establishmentNumberRow].A;
    const regex = /^RMS-GB-000025-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      A: "RMS_ESTABLISHMENT_NO",
      I: "PRODUCT_TYPE_CATEGORY",
      K: "PART_NUMBER_DESCRIPTION",
      L: "TARIFF_CODE_EU",
      M: "PACKAGES",
      O: "NET_WEIGHT_TOTAL",
    };

    for (const key in header) {
      if (
        !packingListJson[sheet][0] ||
        packingListJson[sheet][0][key] !== header[key]
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
