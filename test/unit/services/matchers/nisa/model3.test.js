const Matcher = require("../../../../../app/services/matchers/nisa/model3");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-helpers/models/nisa/model3/data-model");

describe("matchesNisa3", () => {
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";

    const result = Matcher.matches(model.validModel, filename);

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
