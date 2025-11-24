const parser = require("../../../../../app/services/parsers/nisa/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/nisa/model1");
const test_results = require("../../../test-data-and-results/results/nisa/model1");
const parserModel = require("../../../../../app/services/parser-model");
describe("parseNisa1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModelMultipleSheets);

    expect(result).toMatchObject(test_results.validTestResultForMultipleSheets);
  });

  test("parses multiple sheets with headers on different rows", () => {
    const result = parser.parse(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(2);
    expect(result.items[1].row_location.rowNumber).toBe(3);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toMatchObject(test_results.emptyTestResult);
  });

  test("should call logger.logError when an error is thrown", () => {
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
