const nisaMatcher = require("../../../../../../app/services/parsers/nisa/model1/parser");
const matcherResult = require("../../../../../../app/services/matches-result");

describe("matchesNisa", () => {
  test("returns true", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      Something: [
        {
          A: "RMS_ESTABLISHMENT_NO",
          I: "PRODUCT_TYPE_CATEGORY",
          K: "PART_NUMBER_DESCRIPTION",
          L: "TARIFF_CODE_EU",
          M: "PACKAGES",
          O: "NET_WEIGHT_TOTAL",
        },
        {
          A: "RMS-GB-000025-009",
        },
      ],
    };
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.GENERIC_ERROR);
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
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extensions for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Something: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          A: "RMS-GB-000025-009",
        },
      ],
    };
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});