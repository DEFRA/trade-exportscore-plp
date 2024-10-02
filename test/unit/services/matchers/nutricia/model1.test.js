const matcher = require("../../../../../app/services/matchers/nutricia/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/nutricia/model1");
const logger = require("../../../../../app/utilities/logger");

const trader = "Nutricia";
const modelNumber = 1;
const traderAndModelNumber = `${trader}-Model-${modelNumber}`;
const filename = `packinglist${traderAndModelNumber}.xls`;

describe(`matches-${traderAndModelNumber}`, () => {
  test("returns 'Correct' matcher result for valid model", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const packingListJson = {};

    const result = matcher.matches(
      packingListJson,
      `emptyfilename-${filename}`,
    );

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Valid Header, no data' matcher result for file without items", () => {
    const result = matcher.matches(model.validHeadersNoData, "no-data-nutrica");

    expect(result).toBe(matcherResult.VALID_HEADERS_NO_DATA);
  });

  test("returns 'Wrong Establishment Number' matcher result for invalid establishment number", () => {
    const result = matcher.matches(
      model.invalidModel_IncorrectEstablishmentNumber,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return 'Wrong Header' matcher result for incorrect header values", () => {
    const result = matcher.matches(
      model.invalidModel_IncorrectHeaders,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("should call logger.log_error when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "log_error");

    matcher.matches(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
