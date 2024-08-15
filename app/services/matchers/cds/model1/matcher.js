const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matches(packingList, filename) {
  const establishmentNumberRow = 1;
  try {
    console.log(packingList);

    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

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
      A: "TruckID",
      B: "Dept",
      C: "SubDept",
      D: "Product",
      E: "# Packages",
      F: "# Units",
      G: "GrossWeight",
      H: "NetWeight",
      I: "NatureOfProduct",
      J: "Treatment",
      K: "PlaceOfDispatch",
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

module.exports = {
  matches,
};
