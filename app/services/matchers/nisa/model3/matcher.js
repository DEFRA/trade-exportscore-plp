const { ContainerSASPermissions } = require("@azure/storage-blob");
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
      C: "PRODUCT TYPE CATEGORY",
      E: "PART NUMBER DESCRIPTION",
      F: "TARIFF CODE EU",
      G: "PACKAGES",
      I: "NET WEIGHT TOTAL",
    };

    for (const key in header) {
      if (
        !packingList[sheet][2] ||
        packingList[sheet][2][key] !== header[key]
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
