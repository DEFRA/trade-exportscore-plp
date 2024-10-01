const parser = require("../../../../../app/services/parsers/tjmorris/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/tjmorris/model1");
const test_results = require("../../../test-data-and-results/results/tjmorris/model1");

describe("parseTjmorrisModel1", () => {
  test("parses valid json", () => {
    const result = parser.parse(model.validModel.Sheet1);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet1);

    expect(result).toEqual(test_results.emptyModelResult);
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
