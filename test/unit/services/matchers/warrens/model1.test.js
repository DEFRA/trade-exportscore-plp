const matcherResult = require("../../../../../app/services/matcher-result");
const matcher = require("../../../../../app/services/matchers/warrens/model1");
const model = require("../../../test-data-and-results/models/warrens/model1");

const filename = "packinglistWarrens1.xlsx";

describe("matchesWarrens1", () => {
  test("returns correct for correct headers for one sheet", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns correct for correct headers of multiple sheets", () => {
    const result = matcher.matches(model.validModel_Multiple, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(
      packingListJson,
      `emptyfilename-${filename}`,
    );

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Valid Header, no data' for file without items", () => {
    const result = matcher.matches(model.validHeadersNoData, filename);

    expect(result).toBe(matcherResult.VALID_HEADERS_NO_DATA);
  });

  test("returns wrong establishment number for missing establishment number for one sheet", () => {
    const result = matcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const result = matcher.matches(
      model.invalid_Model_IncorrectEstablishmentNumberMultiple,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values of one sheet", () => {
    const result = matcher.matches(
      model.invalid_Model_IncorrectHeader,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("returns wrong header for incorrect header values of multiple sheets", () => {
    const result = matcher.matches(
      model.invalid_Model_IncorrectHeaderMultiple,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
