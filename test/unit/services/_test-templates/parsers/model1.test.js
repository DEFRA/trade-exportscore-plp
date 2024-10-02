const parser = require("../../../../../app/services/parsers/asda/model1");
const model = require("../../../test-data-and-results/models/asda/model1");
const testResults = require("../../../test-data-and-results/results/asda/model1");
const logger = require("../../../../../app/utilities/logger");

const trader = "ASDA";
const modelNumber = 1;
const traderAndModelNumber = `${trader}${modelNumber}`;

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel.PackingList_Extract);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel.PackingList_Extract);

    expect(result).toEqual(testResults.emptyTestResult);
  });

  test("should call logger.log_error when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "log_error");

    parser.parse(null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
