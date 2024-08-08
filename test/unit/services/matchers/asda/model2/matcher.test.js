const Matcher = require("../../../../../../app/services/parsers/asda/model2/parser");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesAsdaModel2", () => {
  test("returns Correct", () => {
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
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          H: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          B: "NOT",
          D: "CORRECT",
          F: "HEADER",
        },
        {
          H: "RMS-GB-000015-010",
        },
      ],
    };
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
