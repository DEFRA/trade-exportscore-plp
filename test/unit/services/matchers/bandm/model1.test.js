const Matcher = require("../../../../../app/services/matchers/bandm/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/bandm/model1");

describe("matchesBandMModel1", () => {
  test("returns correct", () => {
    const filename = "packinglist.xlsx";

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
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "RMS-GB-000005-001",
        },
        {},
        {},
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };

    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
