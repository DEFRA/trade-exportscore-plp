const MatcherResult = require("../matches-result");
const CUSTOMER_ORDER = "Customer Order";
const COUNTRY_OF_ORIGIN = "Country of Origin";

function matchesFowlerWelch(packingListJson, filename) {
  try {
    const headerRowNumber = 44;
    const establishmentNumberRow = 45;
    // check for correct extension
    const fileExtension = filename.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber =
      packingListJson[CUSTOMER_ORDER][establishmentNumberRow].M;
    const regex = /^RMS-GB-000216-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Item",
      B: "Product code",
      C: "Commodity code",
      D: "Online Check",
      E: "Meursing code",
      F: "Description of goods",
      G: COUNTRY_OF_ORIGIN,
      H: "No. of pkgs ",
      I: "Type of pkgs",
      J: "Total Gross Weight",
      K: "Total Net Weight",
      L: "Total Line Value",
      M: "NIIRMS Dispatch number",
      N: "Treatment Type (Chilled /Ambient)",
      O: "NIRMS Lane (R/G)",
      P: "Secondary Qty",
      Q: "Cert Type Req",
      R: "Cert Number",
    };

    const originalHeader = packingListJson[CUSTOMER_ORDER][headerRowNumber];

    for (const key in header) {
      if (!originalHeader[key].startsWith(header[key])) {
        return MatcherResult.WRONG_HEADER;
      }
    }
    return MatcherResult.CORRECT;
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = { matchesFowlerWelch };
