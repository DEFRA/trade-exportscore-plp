const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "PackingList.xlsx";
const packingListJson = {
  Tabelle1: [
    {
      B: "RMS-GB-000098-001",
    },
    {
      A: "Commodity code",
      B: "Description of goods",
      C: "Country of Origin",
      D: "No. of pkgs",
      E: "Type of pkgs",
      F: "Item Gross Weight (kgs)",
      G: "Item Net Weight (kgs)",
      H: "Treatment Type (Chilled /Ambient)",
      I: "NIRMS Lane (R/G)",
    },
  ],
};

describe("matchesBuffaloadModel1", () => {
  test("matches valid Buffaload Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000098-001",
      parserModel: ParserModel.BUFFALOAD1,
    });
  });
});
