const Matcher = require("../../../../../app/services/matchers/tescos/model3");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/tescos/model3/model3");

describe("matchesTescoModel3", () => {
  test("returns Correct", () => {
    const filename = "PackingListTesco3.xlsx";

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
      "Input Data Sheet": [
        {},
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

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "RMS-GB-000022-001",
        },
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Green Lane",
          E: "Packages",
          F: "Gross Weight",
          G: "Net Weight",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
