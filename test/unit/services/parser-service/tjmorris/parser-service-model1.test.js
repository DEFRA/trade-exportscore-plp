const MatchedModel = require("../../../../../app/services/matched-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xls";
const packingListJson = {
  Sheet1: [
    {
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
      T: "Country of Origin",
      U: "VAT Status",
      V: "SPS",
      W: "Consignment ID",
      X: "Processed?",
      Y: "Created Timestamp",
    },
    {
      A: "RMS-GB-000010-001",
    },
  ],
};

describe("matchesTJMorrisModel1", () => {
  test("matches valid TJMorris Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000010-001",
      parserModel: MatchedModel.TJMORRIS1,
    });
  });
});
