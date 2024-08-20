const parserService = require("../../../../../../app/services/parser-service");
const ParserModel = require("../../../../../../app/services/parser-model");

const filename = "packinglist.xlsx";
const packingListJson = {
  "Input Packing Sheet": [
    {
      E: "Dispatch RMS Establishment",
      O: "Product/ Part Number description",
      P: "Tariff Code EU",
      Q: "Packages",
      S: "NW total",
    },
    {
      E: "RMS-GB-000009-001",
      O: "Co-op Red Peppers Each",
      P: "0709601000",
      Q: 12,
      S: 1,
    },
  ],
};

describe("matchesCoopModel1", () => {
  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [
        {
          commodity_code: "0709601000",
          description: "Co-op Red Peppers Each",
          nature_of_products: null,
          number_of_packages: 12,
          total_net_weight_kg: 1,
        },
      ],
      registration_approval_number: "RMS-GB-000009-001",
      parserModel: ParserModel.COOP1,
    });
  });
});
