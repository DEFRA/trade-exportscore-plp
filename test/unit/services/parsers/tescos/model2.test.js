const parser = require("../../../../../app/services/parsers/tescos/model2");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/tescos/model2");
const testResults = require("../../../test-data-and-results/results/tescos/model2");
const parserModel = require("../../../../../app/services/parser-model");

const traderAndModelNumber = parserModel.TESCO2;

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses valid populated json", () => {
    const result = parser.parse(model.validModel.Sheet2);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.Sheet2);

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
