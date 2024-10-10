const parser = require("../../../../../app/services/parsers/co-op/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/co-op/model1");
const test_results = require("../../../test-data-and-results/results/co-op/model1");

describe("parseCoopModel1", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModelMultipleSheets);
    expect(result).toEqual(test_results.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toEqual(test_results.emptyTestResult);
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
