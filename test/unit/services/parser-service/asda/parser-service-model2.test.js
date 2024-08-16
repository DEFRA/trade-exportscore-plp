const MatchedModel = require("../../../../../app/services/matched-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist.xls";
const packingListJson = {
  Sheet1: [
    {
      B: "[Description Of All Retail Go",
      D: "[Nature Of Product]",
      F: "[Treatment Ty",
      H: "Establishment Number",
      J: "Cases",
      L: "Case Weight",
      N: "NET Weight",
    },
    {
      H: "RMS-GB-000015-010",
    },
  ],
};

describe("matchesAsdaModel2", () => {
  test("matches valid Asda Model 2 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000015-010",
      parserModel: MatchedModel.ASDA2,
    });
  });
});
