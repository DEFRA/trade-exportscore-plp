const Matcher = require("../../../../../../app/services/matchers/asda/model1/matcher");
const MatcherResult = require("../../../../../../app/services/matcher-result");
const model = require("../../../../test-helpers/asda/model1/data-model");

const filename = "packinglist.xls";

describe("matchesAsdaModel1", () => {
  test("returns Correct", () => {
    const result = Matcher.matches(model.validModel, filename);

    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const result = Matcher.matches(model.emptyModel, filename);

    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const result = Matcher.matches(model.wrongEstablishment, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const result = Matcher.matches(model.incorrectHeader, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
