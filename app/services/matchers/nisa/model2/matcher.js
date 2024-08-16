const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    const sheet = Object.keys(packingList)[0];
    const establishmentNumber = packingList[sheet][establishmentNumberRow].B;
    const regex = /^RMS-GB-000025-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    const header = {
      B: "RMS_ESTABLISHMENT_NO",
      J: "PRODUCT_TYPE_CATEGORY",
      L: "PART_NUMBER_DESCRIPTION",
      M: "TARIFF_CODE_EU",
      N: "PACKAGES",
      P: "NET_WEIGHT_TOTAL",
    };

    for (const key in header) {
      if (
        !packingList[sheet][0] ||
        packingList[sheet][0][key] !== header[key]
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
