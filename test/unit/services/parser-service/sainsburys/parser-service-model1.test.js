const ParserService = require("../../../../../app/services/parser-service");
const MatcherResult = require("../../../../../app/services/matches-result");
const Matcher = require("../../../../../app/services/matchers/sainsburys/model1/matcher");
const Parser = require("../../../../../app/services/parsers/sainsburys/model1/parser");

const filename = "packinglist.xlsx";
const packingListJson = {
  Sheet1: [
    {
      A: "Delivery Date",
      B: "Load Ref\r\n(Trailer Number)",
      C: "Product Type / Category",
      D: "Product / Part Number",
      E: "Product / Part Number Description",
      F: "Packed Singles",
      G: "Packages",
      H: "Net\r\nWeight / Package KG",
      I: "Gross\r\nWeight / Package KG",
      J: "Packaging Type",
      K: "Excise Code",
      L: "Final Destination ID",
      M: "Dispatch Unit ID",
      N: "RMS Number (based on depot)",
      O: "Commodity Code",
    },
    {
      N: "RMS-GB-000094-001",
    },
  ],
};

describe("matchesSainsburysModel1", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result.isParsed).toBeTruthy();
  });
});
