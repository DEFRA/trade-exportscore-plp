const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/fowlerwelch/model1/matcher");
const Parser = require("../../../../../app/services/parsers/fowlerwelch/model1/parser");

const filename = "packinglist.xlsx";
const packingListJson = {
  "Customer Order": [
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
      A: "Item",
      B: "Product code",
      C: "Commodity code",
      D: "Online Check",
      E: "Meursing code",
      F: "Description of goods",
      G: "Country of Origin",
      H: "No. of pkgs \r\n(1547)",
      I: "Type of pkgs",
      J: "Total Gross Weight \r\n(11015.700kgs)",
      K: "Total Net Weight \r\n(7921.700kgs)",
      L: "Total Line Value \r\n(41662.4)",
      M: "NIIRMS Dispatch number",
      N: "Treatment Type (Chilled /Ambient)",
      O: "NIRMS Lane (R/G)",
      P: "Secondary Qty",
      Q: "Cert Type Req",
      R: "Cert Number",
    },
    {
      M: "RMS-GB-000216-004",
    },
  ],
};

describe("matchesFowlerWelchModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});

describe("parsesFowlerWelchModel1", () => {
  Matcher.matches = jest
    .fn()
    .mockReturnValue(MatcherResult.CORRECT)
    .mockName("FowlerWelchMatcherMock");
  Parser.parse = jest.fn().mockReturnValue({
    items: [],
    business_checks: { all_required_fields_present: null },
  });

  test("matches valid FowlerWelch Model 1 file and calls parser", () => {
    ParserService.findParser(packingListJson, filename);

    expect(Parser.parse).toHaveBeenCalledTimes(1);
  });
});
