const Matcher = require("../../../../../../app/services/matchers/co-op/model1/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");

describe("matchesAsdaModel1", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      PackingList_Extract: [
        {
          E: "Dispatch RMS Establishment",
          O: "Product/ Part Number description",
          P: "Tariff Code EU",
          Q: "Packages",
          S: "NW total",
        },
        {
          E: "RMS-GB-000009-001",
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
      PackingList_Extract: [
        {},
        {},
        {
          E: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          E: "HEADER",
        },
        {
          E: "RMS-GB-000009-001",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
