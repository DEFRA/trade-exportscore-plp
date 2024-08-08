const nisaMatcher = require("../../../../../../app/services/parsers/nisa/model2/matcher");
const matcherResult = require("../../../../../../app/services/matches-result");

describe("matchesNisa2", () => {
  test("returns true", () => {
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
          B: "NOT",
          J: "CORRECT",
          L: "HEADER",
        },
        {
          B: "RMS-GB-000025-002",
        },
      ],
    };
    const result = nisaMatcher.matches(packingListJson, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
