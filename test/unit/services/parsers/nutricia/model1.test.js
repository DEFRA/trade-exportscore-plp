const parser = require("../../../../../app/services/parsers/nutricia/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/nutricia/model1");
const test_results = require("../../../test-data-and-results/results/nutricia/model1");

describe("parseNutricaModel1", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel.DANONE);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.DANONE);

    expect(result).toEqual(test_results.emptyModelResult);
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
module.exports = {};
