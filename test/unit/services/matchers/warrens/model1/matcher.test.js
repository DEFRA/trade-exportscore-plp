const MatcherResult = require("../../../../../../app/services/matches-result");
const warrensMatcher = require("../../../../../../app/services/matchers/warrens/model1/matcher");
const model = require("../../../../test-helpers/warrens/model1/data-model");

describe("matchesWarrens1", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number for one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumber,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumberMultiple,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values of one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(
      model.invalid_Model_IncorrectHeader,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(
      model.invalid_Model_IncorrectHeaderMultiple,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns correct for correct headers for one sheet", () => {
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(model.validModel, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns correct for correct headers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = warrensMatcher.matches(model.validModel_Multiple, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});
