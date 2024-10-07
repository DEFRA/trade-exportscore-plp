const parser = require("../../../../../app/services/parsers/giovanni/model1");
const logger = require("../../../../../app/utilities/logger");
const parser_model = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/giovanni/model1");
const testResults = require("../../../test-data-and-results/results/giovanni/model1");

describe("parseGiovanniModel1", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel);
    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = Parser.parse(model.validModelMultipleSheets);
    expect(result).toEqual(testResults.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);
    expect(result).toEqual(testResults.emptyTestResult);
  });

  test("should call logger.log_error when an error is thrown", () => {
    // Spy on the log_error method
    const logErrorSpy = jest.spyOn(logger, "log_error");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.log_error has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
