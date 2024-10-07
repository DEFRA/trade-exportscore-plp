const matcher = require("../../../../../app/services/matchers/co-op/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/co-op/model1");

describe("matchesCoopModel1", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xlsx";

    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
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

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          E: "HEADER",
          O: "Product/ Part Number description",
        },
        {
          E: "RMS-GB-000009-001",
        },
      ],
    };

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
