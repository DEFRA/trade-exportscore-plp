const matcher = require("../../../../../app/services/matchers/davenport/model1");
const matcher_result = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/davenport/model1");

const filename = "packinglistDavenport1.xlsx";

describe("matchesDavenportModel1", () => {
  test("returns 'Correct' for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns 'Generic Error' for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(packingListJson, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });

  test("returns 'Wrong Establishment Number' for missing establishment number", () => {
    const result = matcher.matches(
      model.invalidModel_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong header for missing header values", () => {
    const result = matcher.matches(model.invalidModel_MissingHeaders, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
    const filename = "packinglist.xlsx";

    const result = matcher.matches(
      model.invalidModel_IncorrectHeaders,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
