const parser = require("../../../../../app/services/parsers/tjmorris/model2");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/tjmorris/model2");
const test_results = require("../../../test-data-and-results/results/tjmorris/model2");

describe("parseTjmorrisModel2", () => {
  test("parses valid json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModelMultipleSheets);

    expect(result).toMatchObject(test_results.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toMatchObject(test_results.emptyModelResult);
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
