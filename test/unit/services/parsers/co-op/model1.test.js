const parser = require("../../../../../app/services/parsers/co-op/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/co-op/model1");
const testResults = require("../../../test-data-and-results/results/co-op/model1");

const trader = "Co-Op";
const modelNumber = 1;
const traderAndModelNumber = `${trader}${modelNumber}`;

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel["Input Packing Sheet"]);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel["Input Packing Sheet"]);

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
