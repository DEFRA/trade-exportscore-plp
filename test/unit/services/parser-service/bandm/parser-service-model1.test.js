const MatchedModel = require("../../../../../app/services/matched-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xlsx";
const packingListJson = {
  Sheet1: [
    {},
    {},
    {
      H: "WAREHOUSE SCHEME NUMBER:",
      I: "RMS-GB-000005-001",
    },
    {},
    {},
    {
      A: "PRODUCT CODE (SHORT)",
      B: "PRISM",
      C: "ITEM DESCRIPTION",
      D: "COMMODITY CODE",
      E: "PLACE OF DISPATCH",
      F: "TOTAL NUMBER OF CASES",
      G: "NET WEIGHT",
      H: "GROSS WEIGHT",
      I: "ANIMAL ORIGIN",
    },
  ],
};

describe("matchesBAndMModel1", () => {
  test("matches valid BAndM Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000005-001",
      parserModel: MatchedModel.BANDM1,
    });
  });
});
