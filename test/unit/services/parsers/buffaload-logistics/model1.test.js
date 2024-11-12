const parser = require("../../../../../app/services/parsers/buffaload-logistics/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/buffaload-logistics/model1");
const test_results = require("../../../test-data-and-results/results/buffaload-logistics/model1");
const parserModel = require("../../../../../app/services/parser-model");
describe("parsesBuffaloadLogisticsModel1", () => {
  test("parses valid json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(test_results.validTestResult);
  });
  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModelMultipleSheets);

    expect(result).toEqual(test_results.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toEqual(test_results.emptyModelResult);
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
