const Matcher = require("../../../../../app/services/matchers/davenport/model1");
const MatcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-helpers/davenport/model1/data-model");

describe("matchesDavenportModel1", () => {
  test("returns Correct", () => {
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
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(
      model.invalidModel_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for missing header values", () => {
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(model.invalidModel_MissingHeaders, filename);

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";

    const result = Matcher.matches(
      model.invalidModel_IncorrectHeaders,
      filename,
    );

    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});