const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/tescos/model3/matcher");
const Parser = require("../../../../../app/services/parsers/tescos/model3/parser");

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

describe("matchesTescoModel3", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});

describe("parsesTescoModel3", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("TescoMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid Tesco Model 3 file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});
