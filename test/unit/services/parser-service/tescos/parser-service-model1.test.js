const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/tescos/model1/matcher");
const Parser = require("../../../../../app/services/parsers/tescos/model1/parser");

const filename = "PackingListTesco1.xlsx";
const packingListJson = {
  "Input Data Sheet": [
    {},
    {},
    {},
    {
      AT: "RMS-GB-000022-998",
    },
    {
      G: "Product/ Part Number description",
      L: "Tariff Code UK",
      AS: "Treatment Type",
      AT: "Green Lane",
      BR: "Packages",
      BT: "Gross Weight",
      BU: "Net Weight",
    },
  ],
};

// ToDo - fix this!!!
describe("matchesTescoModel1", () => {
  test.skip("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});
