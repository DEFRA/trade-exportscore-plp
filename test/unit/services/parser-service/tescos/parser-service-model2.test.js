const parserService = require("../../../../../app/services/parser-service");

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
  test("returns isParsed as true", () => {
    const result = parserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Tescos Model 2 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [],
        registration_approval_number: "RMS-GB-000015-009",
      },
    });
  });
});
