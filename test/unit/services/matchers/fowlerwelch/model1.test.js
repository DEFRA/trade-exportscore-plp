const matcherResult = require("../../../../../app/services/matcher-result");
const matcher = require("../../../../../app/services/matchers/fowlerwelch/model1");
const model = require("../../../test-data-and-results/models/fowlerwelch/model1");
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");

const traderAndModelNumber = parserModel.FOWLERWELCH1;
const filename = `packinglist-${traderAndModelNumber}.xls`;

describe(`matches-${traderAndModelNumber}`, () => {
  test("returns 'Correct' matcher result for correct headers for one sheet", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Correct' matcher result for correct headers of multiple sheets", () => {
    const result = matcher.matches(model.validModel_Multiple, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const result = matcher.matches({}, `emptyfilename-${filename}`);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Valid Header, no data' matcher result for file without items", () => {
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

  test("if the key is equal to 'K' and doesn't include 'Net Weight' in its header, return wrong header", () => {
    const result = matcher.matches(
      model.invalid_Model_IncorrectHeaderNoNetWeight,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("if the header doesn't start with the header[key], return wrong header", () => {
    const result = matcher.matches(
      model.invalid_Model_IncorrectHeaderNoNetWeight2,
      filename,
    );

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("if all required headers are missing, return wrong header", () => {
    const result = matcher.matches(model.invalidModel_MissingHeaders, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("should call logger.log_error when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "log_error");

    matcher.matches(null, null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
