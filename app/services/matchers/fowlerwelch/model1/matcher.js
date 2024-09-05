const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

function matchesModel(packingList, filename, remosNumber, trader) {
  let headerRow = 0;

  try {
    // check for correct extension

    if (FileExtension.matches(filename, "xlsx") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    //check for correct establishment number

    const sheets = Object.keys(packingList);

    if (sheets.length === 0) {
      throw new Error("generic error");
    }

    for (const sheet of sheets) {
      headerRow = packingList[sheet].findIndex(
        (x) => x.F === "Description of goods",
      );
      const establishmentNumber = packingList[sheet][headerRow + 1].M;
      if (!remosNumber.test(establishmentNumber)) {
        return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values

      const header = {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
      };

      for (const key in header) {
        if (
          (key === "K" &&
            !packingList[sheet][headerRow][key]
              .toLowerCase()
              .includes("net weight")) ||
          (key !== "K" &&
            !packingList[sheet][headerRow][key]
              .toLowerCase()
              .startsWith(header[key].toLowerCase()))
        ) {
          return MatcherResult.WRONG_HEADER;
        }
      }
    }

    console.info(`Packing list matches ${trader} with filename: ${filename}`);
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

function matches(packingList, filename) {
  return matchesModel(
    packingList,
    filename,
    /^RMS-GB-000216-\d{3}$/,
    "Fowler Welch",
  );
}

module.exports = { matches, matchesModel };
