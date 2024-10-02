const parser = require("../../../../../app/services/parsers/davenport/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/davenport/model1");
const testResults = require("../../../test-data-and-results/results/davenport/model1");
const parserModel = require("../../../../../app/services/parser-model");

const traderAndModelNumber = parserModel.DAVENPORT1;

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses valid populated json", () => {
    const packingListJson = model.validModel.Customer_Order;

    const result = parser.parse(packingListJson);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyModelResult);
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
