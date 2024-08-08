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

// ToDo - fix this!!!
describe("matchesTescoModel3", () => {
  test.skip("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});
