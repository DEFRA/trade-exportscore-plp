const matcherResult = require("../../../../../app/services/matcher-result");
const matcher = require("../../../../../app/services/matchers/giovanni/model2");
const model = require("../../../test-data-and-results/models/giovanni/model2");
const logger = require("../../../../../app/utilities/logger");

const filename = "packinglist.xlsx";

describe("matchesGiovanni", () => {
  test("returns 'Empty File' matcher result for empty json", () => {
    const result = matcher.matches({}, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns Correct", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment number", () => {
    const result = matcher.matches(
      model.incorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns 'Wrong Establishment Number' matcher result for missing establishment numbers of multiple sheets", () => {
    const result = matcher.matches(model.wrongEstablishmentMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values", () => {
    const result = matcher.matches(model.incorrectHeader, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values of multiple sheets", () => {
    const result = matcher.matches(model.incorrectHeaderMultiple, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("return 'Generic Error' matcher result when an error occurs", () => {
    const result = matcher.matches(null, null);

    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });

  test("should call logger.logError when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "logError");

    matcher.matches(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
