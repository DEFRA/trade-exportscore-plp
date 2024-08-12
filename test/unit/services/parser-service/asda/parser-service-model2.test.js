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
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Asda Model 2 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      isParsed: true,
      packingList: {
        business_checks: {
          all_required_fields_present: true,
        },
        items: [],
        registration_approval_number: "RMS-GB-000015-010",
      },
    });
  });
});
