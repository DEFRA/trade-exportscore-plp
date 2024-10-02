const parser = require("../../../../../app/services/parsers/warrens/model1");
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/warrens/model1");
const testResults = require("../../../test-data-and-results/results/warrens/model1");

const trader = "Warrens";
const modelNumber = 1;
const traderAndModelNumber = `${trader}-Model-${modelNumber}`;

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses valid populated json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModel_Multiple);

    expect(result).toEqual(testResults.validTestResultMultiple);
  });

  test("parses empty json", () => {
    const packingListJson = model.validHeadersNoData;

    const result = parser.parse(packingListJson);

    expect(result).toEqual(testResults.emptyFile);
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
