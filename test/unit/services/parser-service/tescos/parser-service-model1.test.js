const ParserService = require("../../../../../app/services/parser-service");

const filename = "PackingListTesco1.xlsx";
const packingListJson = {
  "Input Data Sheet": [
    {},
    {},
    {},
    {
      AT: "RMS-GB-000022-998",
    },
    {
      G: "Product/ Part Number description",
      L: "Tariff Code UK",
      AS: "Treatment Type",
      AT: "Green Lane",
      BR: "Packages",
      BT: "Gross Weight",
      BU: "Net Weight",
    },
  ],
};

describe("matchesTescosModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Tescos Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [],
        registration_approval_number: "RMS-GB-000022-998",
      },
    });
  });
});
