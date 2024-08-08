const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/buffaload-logistics/model1/matcher");
const Parser = require("../../../../../app/services/parsers/buffaload-logistics/model1/parser");

const filename = "PackingList.xlsx";
const packingListJson = {
  Tabelle1: [
    {
      B: "RMS-GB-000098-001",
    },
    {
      A: "Commodity code",
      B: "Description of goods",
      C: "Country of Origin",
      D: "No. of pkgs",
      E: "Type of pkgs",
      F: "Item Gross Weight (kgs)",
      G: "Item Net Weight (kgs)",
      H: "Treatment Type (Chilled /Ambient)",
      I: "NIRMS Lane (R/G)",
    },
  ],
};

describe("matchesBuffaloadLogisticsModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});

describe("parsesBuffaloadLogisticsModel1", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("BuffaloadLogisticsMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid BuffaloadLogistics Model 1 file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});
