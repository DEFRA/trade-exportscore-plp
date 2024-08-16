const MatchedModel = require("../../../../../app/services/matched-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xls";
const packingListJson = {
  PackingList_Extract: [
    {
      A: "[Description Of All Retail Goods]",
      B: "[Nature Of Product]",
      C: "[Treatment Type]",
      D: "[Number Of Establishment]",
      E: "[Destination Store Establishment Number]",
      F: "[Number of Packages]",
      G: "[Net Weight]",
      H: "[kilograms/grams]",
    },
    {
      D: "RMS-GB-000015-001",
    },
  ],
};

describe("matchesAsdaModel1", () => {
  test("matches valid Asda Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000015-001",
      parserModel: MatchedModel.ASDA1,
    });
  });
});
