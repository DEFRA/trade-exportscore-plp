const Matcher = require("../../../../../../app/services/matchers/nisa/model3/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesNisa3", () => {
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      sheet: [
        {
          A: "RMS_ESTABLISHMENT_NO",
        },
        {
          A: "RMS-GB-000025-003",
        },
        {},
        {
          C: "PRODUCT_TYPE_CATEGORY",
          E: "PART_NUMBER_DESCRIPTION",
          F: "TARIFF_CODE_EU",
          G: "PACKAGES",
          H: "NET_WEIGHT_TOTAL"
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
      sheet: [
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
      sheet: [
        {
          A: "NOT",
          J: "CORRECT",
          L: "HEADER",
        },
        {
          A: "RMS-GB-000025-003",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
