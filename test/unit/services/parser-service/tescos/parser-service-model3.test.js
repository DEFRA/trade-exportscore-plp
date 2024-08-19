const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "PackingListTesco3.xlsx";
const packingListJson = {
  "Input Data Sheet": [
    {},
    {},
    {},
    {
      E: "RMS-GB-000022-999",
    },
    {
      A: "Product/ Part Number description",
      B: "Tariff Code UK",
      C: "Treatment Type",
      D: "Green Lane",
      E: "Packages",
      F: "Gross Weight",
      G: "Net Weight",
    },
  ],
};

describe("matchesTescosModel3", () => {
  test("matches valid Tescos Model 3 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000022-999",
      parserModel: ParserModel.TESCO3,
    });
  });
});
