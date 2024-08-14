const MatcherResult = require("../matches-result");
const COUNTRY_OF_ORIGIN = "Country of Origin";

function matches(packingList, filename) {
  const establishmentNumberRow = 45;
  const headerRowNumber = 44;

  try {
    // check for correct extension
    const fileExtension = filename.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    //check for correct establishment number

    const sheets = Object.keys(packingList);
    if (sheets.length === 0) {
      throw new Error("generic error");
    }
    //maybe needs -1
    for (let i = 0; i < sheets.length; i++) {
      const establishmentNumber =
        packingList[sheets[i]][establishmentNumberRow].M;
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
        if (packingList[sheets[i]][44][key] !== header[key]) {
          return MatcherResult.WRONG_HEADER;
        }
      }
    }
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matches };
