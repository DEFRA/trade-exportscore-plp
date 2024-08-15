const Matcher = require("../../../../../../app/services/matchers/buffaload-logistics/model1/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesBuffaloadLogisticsModel1", () => {
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      Tabelle1: [
        {
          B: "RMS-GB-000098-001",
        },
        {
          A: "Commodity code",
          B: "Description of goods",
          C: "Country of Origin",
          D: "No. of pkgs",
          E: "Type of pkgs",
          F: "Item Gross Weight (kgs)",
          G: "Item Net Weight (kgs)",
          H: "Treatment Type (Chilled /Ambient)",
          I: "NIRMS Lane (R/G)",
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
      Tabelle1: [
        {
          B: "INCORRECT",
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
      Tabelle1: [
        {
          B: "RMS-GB-000098-001",
        },
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
