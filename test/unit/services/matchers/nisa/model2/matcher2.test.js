const Matcher = require("../../../../../../app/services/matchers/nisa/model2/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesNisa2", () => {
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      Something: [
        {
          B: "RMS_ESTABLISHMENT_NO",
          J: "PRODUCT_TYPE_CATEGORY",
          L: "PART_NUMBER_DESCRIPTION",
          M: "TARIFF_CODE_EU",
          N: "PACKAGES",
          P: "NET_WEIGHT_TOTAL",
        },
        {
          B: "RMS-GB-000025-002",
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
      Something: [
        {},
        {
          A: "INCORRECT",
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
      Something: [
        {
          B: "NOT",
          J: "CORRECT",
          L: "HEADER",
        },
        {
          B: "RMS-GB-000025-002",
        },
      ],
    };
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
