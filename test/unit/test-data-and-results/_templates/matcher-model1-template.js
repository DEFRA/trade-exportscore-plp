// The commented out lines should be uncommented and any placeholders updated.
// The lines have been commented to prevent the tests from failing as they are not valid.
// const Matcher = require("../../../../app/services/matchers/{replaceWithActualCompanyName}/model1");
const MatcherResult = require("../../../../app/services/matcher-result");
// const model = require("../../test-data-and-results/models/{replaceWithActualCompanyName}/model1");

const filename = "packinglist.xls";

describe("matches{replaceWithActualCompanyName}Model1", () => {
  test("returns 'Correct' for valid JSON", () => {
    // const result = Matcher.matches(model.validModel, filename);
    // expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    // const result = Matcher.matches(model.emptyModel, filename);
    // expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    // const result = Matcher.matches(model.wrongEstablishment, filename);
    // expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    // const result = Matcher.matches(model.incorrectHeader, filename);
    // expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});
