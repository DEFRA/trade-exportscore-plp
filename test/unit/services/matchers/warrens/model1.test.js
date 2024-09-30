const matcher_result = require("../../../../../app/services/matcher-result");
const warrens_matcher = require("../../../../../app/services/matchers/warrens/model1");
const model = require("../../../test-data-and-results/models/warrens/model1");

const filename = "packinglistWarrens1.xlsx";

describe("matchesWarrens1", () => {
  test("returns correct for correct headers for one sheet", () => {
    const result = warrens_matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns correct for correct headers of multiple sheets", () => {
    const result = warrens_matcher.matches(model.validModel_Multiple, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns 'Generic Error' for empty json", () => {
    const packingListJson = {};

    const result = warrens_matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number for one sheet", () => {
    const result = warrens_matcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const result = warrens_matcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumberMultiple,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values of one sheet", () => {
    const result = warrens_matcher.matches(
      model.invalid_Model_IncorrectHeader,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const result = warrens_matcher.matches(
      model.invalid_Model_IncorrectHeaderMultiple,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
