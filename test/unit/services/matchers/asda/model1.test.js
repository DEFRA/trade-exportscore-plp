const matcher = require("../../../../../app/services/matchers/asda/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/asda/model1");

const filename = "packinglist.xls";

describe("matchesAsdaModel1", () => {
  test("returns Correct", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const result = matcher.matches(model.wrongEstablishment, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for incorrect header values", () => {
    const result = matcher.matches(model.incorrectHeader, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
