/**
 * Tesco Model 1 parser tests
 *
 * DEPRECATED: Tesco Model 1 format is no longer supported as of December 2025.
 * All instances now return NOMATCH. Tests remain for historical reference.
 */
const parser = require("../../../../../app/services/parsers/tescos/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/tescos/model1");
const test_results = require("../../../test-data-and-results/results/tescos/model1");
describe("parseTescoModel1 - DEPRECATED", () => {
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
    expect(result.items[0].row_location.rowNumber).toBe(3);
    expect(result.items[1].row_location.rowNumber).toBe(4);
  });

  test("parses missing required values", () => {
    const result = parser.parse(model.invalidModel_MissingColumnCells);

    expect(result).toMatchObject(
      test_results.invalidTestResult_MissingCellsInParse,
    );
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
