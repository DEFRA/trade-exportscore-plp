const MatcherResult = require("../../../../../../app/services/matches-result");
const Matcher = require("../../../../../../app/services/matchers/giovanni/model1/matcher");
const model = require("../../../../test-helpers/giovanni/model1/data-model");

describe("matchesGiovanni", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = Matcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });
  test("returns Correct", () => {
    const filename = "PackingList.xlsx";

    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });
  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      RANA: [
        {
          A: "INCORRECT",
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
      RANA: [
        {
          A: "RMS-GB-000153",
        },
        {
          C: "NOT",
          G: "CORRECT",
          H: "HEADER",
          E: "Commodity Code",
        },
      ],
    };
    const result = Matcher.matches(packingListJson, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
