const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/bandm/model1/matcher");
const Parser = require("../../../../../app/services/parsers/bandm/model1/parser");

const filename = "packinglist.xlsx";
const packingListJson = {
  Sheet1: [
    {},
    {},
    {
      H: "WAREHOUSE SCHEME NUMBER:",
      I: "RMS-GB-000005-001",
    },
    {},
    {},
    {
      A: "PRODUCT CODE (SHORT)",
      B: "PRISM",
      C: "ITEM DESCRIPTION",
      D: "COMMODITY CODE",
      E: "PLACE OF DISPATCH",
      F: "TOTAL NUMBER OF CASES",
      G: "NET WEIGHT",
      H: "GROSS WEIGHT",
      I: "ANIMAL ORIGIN",
    },
  ],
};

describe("matchesBandMModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});

describe("parsesBAndMModel1", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("BAndMMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid BAndM Model 1 file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});
