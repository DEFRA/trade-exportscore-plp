const parserService = require("../../../../../app/services/parser-service");
const ParserModel = require("../../../../../app/services/parser-model");

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
  test("matches valid Tescos Model 3 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(packingListJson, filename);

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
