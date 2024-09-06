const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");
const { rowFinder } = require("../../../../utilities/row-finder");
function matches(packingList, filename) {
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
      function callback(x) {
        return x.F === "Description of goods";
      }

      headerRow = rowFinder(packingList[sheet], callback);
      if (headerRow === -1) {
        console.log(headerRow);
        return MatcherResult.WRONG_HEADER;
      }
      const establishmentNumber = packingList[sheet][headerRow + 1].M;
      const regex = /^RMS-GB-000216-\d{3}$/;
      if (!regex.test(establishmentNumber)) {
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

    console.info("Packing list matches Fowler Welch with filename: ", filename);
    return MatcherResult.CORRECT;
  } catch (err) {
    console.log(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
