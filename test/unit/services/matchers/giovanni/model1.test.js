const matcher_result = require("../../../../../app/services/matcher-result");
const matcher = require("../../../../../app/services/matchers/giovanni/model1");
const model = require("../../../test-data-and-results/models/giovanni/model1");

const filename = "packingListGiovanni1.xlsx";

describe("matchesGiovanni", () => {
  test("returns 'Correct' for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcher_result.CORRECT);
  });

  test("returns 'Generic Error' for empty json", () => {
    const result = matcher.matches({}, filename);

    expect(result).toBe(matcher_result.GENERIC_ERROR);
  });
  test("returns 'Wrong Establishment Number' for missing establishment number", () => {
    const result = matcher.matches(
      model.incorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcher_result.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' for incorrect header values", () => {
    const result = matcher.matches(model.incorrectHeader, filename);

    expect(result).toBe(matcher_result.WRONG_HEADER);
  });
});
