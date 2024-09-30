const parser = require("../../../../../app/services/parsers/nisa/model2");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/nisa/model2");
const test_results = require("../../../test-data-and-results/results/nisa/model2");

describe("parseNisa2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.sheet);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.sheet);

    expect(result).toEqual(test_results.emptyTestResult);
  });

  test("should call logger.log_error when an error is thrown", () => {
    // Spy on the log_error method
    const logErrorSpy = jest.spyOn(logger, "log_error");
    // Call the parse function with null data
    const result = parser.parse(null);
    // Check if logger.log_error has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
