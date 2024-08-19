const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "PackingListTesco2.xlsx";
const packingListJson = {
  Sheet2: [
    {
      A: "Item",
      B: "Product code",
      C: "Commodity code",
      D: "Online Check",
      E: "Meursing code",
      F: "Description of goods",
      G: "Country of Origin",
      H: "No. of pkgs",
      I: "Type of pkgs",
      J: "Total Gross Weight",
      K: "Total Net Weight",
      L: "Total Line Value",
      M: "GB Establishment RMS Number",
    },
    {},
    {
      M: "RMS-GB-000015-009",
    },
  ],
};

describe("matchesTescosModel2", () => {
  test("matches valid Tescos Model 2 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000015-009",
      parserModel: ParserModel.TESCO2,
    });
  });
});
