const parser = require("../../../../../app/services/parsers/asda/model1"); // Update as required
const model = require("../../../test-data-and-results/models/asda/model1"); // Update as required
const testResults = require("../../../test-data-and-results/results/asda/model1"); // Update as required
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");

const traderAndModelNumber = parserModel.ASDA1; // Update as required

describe(`parses-${traderAndModelNumber}`, () => {
  test("parses valid populated json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toMatchObject(testResults.validTestResult);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toMatchObject(testResults.emptyTestResult);
  });

  test("should call logger.logError when an error is thrown", () => {
    const logErrorSpy = jest.spyOn(logger, "logError");

    parser.parse(null);

    expect(logErrorSpy).toHaveBeenCalled();
  });
});
