const parser = require("../../../../../app/services/parsers/asda/model1"); // Update as required
const model = require("../../../test-data-and-results/models/asda/model1"); // Update as required
const testResults = require("../../../test-data-and-results/results/asda/model1"); // Update as required
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");

const traderAndModelNumber = parserModel.ASDA1; // Update as required

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses valid populated json", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

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
