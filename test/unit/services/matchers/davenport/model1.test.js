const matcher = require("../../../../../app/services/matchers/davenport/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/davenport/model1");

describe("matchesDavenportModel1", () => {
  test("returns Correct", () => {
    const filename = "packinglist.xlsx";

    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const filename = "packinglist.xlsx";

    const result = matcher.matches(
      model.invalidModel_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong establishment number for missing establishment numbers of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for missing header values", () => {
    const filename = "packinglist.xlsx";

    const result = matcher.matches(model.invalidModel_MissingHeaders, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";

    const result = matcher.matches(
      model.invalidModel_IncorrectHeaders,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values of multiple sheets", () => {
    const filename = "packinglist.xlsx";
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });
});
