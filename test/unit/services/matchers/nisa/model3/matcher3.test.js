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
        {
          C: "PRODUCT TYPE CATEGORY",
          E: "PART NUMBER DESCRIPTION",
          F: "TARIFF CODE EU",
          G: "PACKAGES",
          I: "NET WEIGHT TOTAL",
        },
        {
          C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
          E: "DAIRYLEA DUNKERS JUMBO PM80P",
          F: "2005995090",
          G: 2,
          I: 2.5,
        },
        {
          C: "900 - VEGETABLES PREPACK-C",
          E: "NISA BROCCOLI",
          F: "0403209300",
          G: 1,
          I: 2,
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
