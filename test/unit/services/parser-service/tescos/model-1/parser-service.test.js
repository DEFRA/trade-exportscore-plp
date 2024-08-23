const parserService = require("../../../../../../app/services/parser-service");
const ParserModel = require("../../../../../../app/services/parser-model");

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
  test("matches valid Tescos Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000022-998",
      parserModel: ParserModel.TESCO1,
    });
  });
});
