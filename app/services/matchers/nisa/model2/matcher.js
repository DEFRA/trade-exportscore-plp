const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { matchesHeader } = require("../../../matches-header");
const { rowFinder } = require("../../../../utilities/row-finder");
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
      J: "PRODUCT_TYPE_CATEGORY",
      L: "PART_NUMBER_DESCRIPTION",
      M: "TARIFF_CODE_EU",
      N: "PACKAGES",
      P: "NET_WEIGHT_TOTAL",
    };

    function callback(x) {
      return x.P === "NET_WEIGHT_TOTAL";
    }

    const headerRow = rowFinder(packingList[sheet], callback);
    if (headerRow === -1) {
      return MatcherResult.WRONG_HEADER;
    }
    const result = matchesHeader(header, packingList[sheet][headerRow]);
    if (result === MatcherResult.CORRECT) {
      console.info(
        "Packing list matches Nisa Model 2 with filename: ",
        filename,
      );
    }
    return result;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
