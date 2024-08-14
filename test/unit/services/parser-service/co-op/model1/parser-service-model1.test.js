const ParserService = require("../../../../../../app/services/parser-service");

const filename = "packinglist.xlsx";
const packingListJson = {
  Sheet1: [
    {
      E: "Dispatch RMS Establishment",
      O: "Product/ Part Number description",
      P: "Nature Of Product",
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
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Co-op Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [
          {
            commodity_code: null,
            description: "Co-op Red Peppers Each",
            nature_of_products: "0709601000",
            number_of_packages: 12,
            total_net_weight_kg: 1,
          },
        ],
        registration_approval_number: "RMS-GB-000009-001",
      },
    });
  });
});
