const Matcher = require("../../../../../../app/services/matchers/tescos/model2/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesTescoModel2", () => {
  test("returns Correct", () => {
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
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet2: [
        {},
        {},
        {
          M: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extensions for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet2: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {},
        {
          M: "RMS-GB-000015-009",
        },
      ],
    };
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
