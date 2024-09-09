const Matcher = require("../../../../../../app/services/matchers/asda/model1/matcher");
const MatcherResult = require("../../../../../../app/services/matches-result");
const model = require("../../../../test-helpers/asda/model1/data-model");

describe("matchesAsdaModel1", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xls";

    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      PackingList_Extract: [
        {},
        {},
        {
          I: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xls";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          D: "RMS-GB-000015-001",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
