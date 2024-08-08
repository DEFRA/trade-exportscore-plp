const Matcher = require("../../../../../../app/services/parsers/bandm/model1/parser");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesBandMModel1", () => {
  test("returns correct", () => {
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
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
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
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
