const Matcher = require("../../../../../../app/services/parsers/asda/model1/parser");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesAsdaModel1", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "[Description Of All Retail Goods]",
          B: "[Nature Of Product]",
          C: "[Treatment Type]",
          D: "[Number Of Establishment]",
          E: "[Destination Store Establishment Number]",
          F: "[Number of Packages]",
          G: "[Net Weight]",
          H: "[kilograms/grams]",
        },
        {
          D: "RMS-GB-000015-001",
        },
      ],
    };
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      PackingList_Extract: [
        {},
        {},
        {
          I: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          D: "RMS-GB-000015-001",
        },
      ],
    };
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
