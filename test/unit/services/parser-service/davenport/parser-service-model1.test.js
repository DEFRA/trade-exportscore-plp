const ParserService = require("../../../../../app/services/parser-service");
const ParserModel = require("../../../../../app/services/parser-model");

const filename = "packinglist.xlsx";
const packingListJson = {
  PackingList_Extract: [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    { C: "RMS-GB-000323-001" },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {
      C: "Commodity Code",
      F: "Description of Goods",
      H: "No. of Pkgs(180)",
      K: "Total Net Weight(X)",
    },
  ],
};

describe("matchesDavenportModel1", () => {
  test("matches valid Davenport Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000323-001",
      parserModel: ParserModel.DAVENPORT1,
    });
  });
});
