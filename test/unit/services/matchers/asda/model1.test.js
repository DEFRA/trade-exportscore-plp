const Matcher = require("../../../../../app/services/matchers/asda/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/asda/model1");

const filename = "packinglist.xls";

describe("matchesAsdaModel1", () => {
  test("returns Correct", () => {
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
    const result = Matcher.matches(model.wrongEstablishment, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const result = Matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const result = Matcher.matches(model.incorrectHeader, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const result = Matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
