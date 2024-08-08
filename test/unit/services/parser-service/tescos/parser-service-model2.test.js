const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/tescos/model2/matcher");
const Parser = require("../../../../../app/services/parsers/tescos/model2/parser");

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

describe("matchesTescoModel2", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});
