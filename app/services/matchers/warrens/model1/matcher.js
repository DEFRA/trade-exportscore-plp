const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

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

    for (let sheet of sheets) {
      console.log(sheet);
      headerRow = packingList[sheet].findIndex(
        (x) => x.F === "Description of goods",
      );

      let establishmentNumber = packingList[sheet][headerRow + 1].M;
      console.log(establishmentNumber);
      if (establishmentNumber === undefined) {
        establishmentNumber = packingList[sheet][headerRow + 2].M;
      }
      const regex = /^RMS-GB-000174-\d{3}$/;
      if (!regex.test(establishmentNumber)) {
        return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
      }

      // check for header values

      const header = {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        L: "Item value",
        N: "Treatment Type (Chilled /Ambient)",
      };

      for (const key in header) {
        if (!packingList[sheet][headerRow][key].startsWith(header[key])) {
          console.log(packingList[sheet][headerRow][key]);
          return MatcherResult.WRONG_HEADER;
        }
      }
    }

    console.info("Packing list matches Warrens with filename: ", filename);
    return MatcherResult.CORRECT;
  } catch (err) {
    console.log(err);
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
