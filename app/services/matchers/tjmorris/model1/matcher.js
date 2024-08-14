const MatcherResult = require("../../../matches-result");
const FileExtension = require("../../../../utilities/file-extension");

const COUNTRY_OF_ORIGIN = "Country of Origin";

function matches(packingListJson, filename) {
  try {
    if (FileExtension.matches(filename, "xls") !== MatcherResult.CORRECT) {
      return MatcherResult.WRONG_EXTENSIONS;
    }

    // check for correct establishment number
    const establishmentNumber = packingListJson.Sheet1[1]?.A;
    const regex = /^RMS-GB-000010-\d{3}$/;
    if (!regex.test(establishmentNumber)) {
      return MatcherResult.WRONG_ESTABLISHMENT_NUMBER;
    }

    // check for header values
    const header = {
      A: "Consignor / Place o f Despatch",
      B: "CONSIGNEE",
      C: "Trailer",
      D: "Seal",
      E: "Store",
      F: "STORENAME",
      G: "Order",
      H: "Cage/Ref",
      I: "Group",
      J: "TREATMENTTYPE",
      K: "Sub-Group",
      L: "Description",
      M: "Item",
      N: "Description",
      O: "Tariff/Commodity",
      P: "Cases",
      Q: "Gross Weight Kg",
      R: "Net Weight Kg",
      S: "Cost",
      T: COUNTRY_OF_ORIGIN,
      U: "VAT Status",
      V: "SPS",
      W: "Consignment ID",
      X: "Processed?",
      Y: "Created Timestamp",
    };

    if (JSON.stringify(packingListJson.Sheet1[0]) !== JSON.stringify(header)) {
      return MatcherResult.WRONG_HEADER;
    } else {
      return MatcherResult.CORRECT;
    }
  } catch (err) {
    return MatcherResult.GENERIC_ERROR;
  }
}

module.exports = {
  matches,
};
