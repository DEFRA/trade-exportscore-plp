const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/asda/model2/matcher");
const Parser = require("../../../../../app/services/parsers/asda/model2/parser");

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
});

describe("parsesAsdaModel2", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("AsdaMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid Asda Model 2 file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});