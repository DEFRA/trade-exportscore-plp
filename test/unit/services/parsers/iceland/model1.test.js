const parser = require("../../../../../app/services/parsers/iceland/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/iceland/model1");
const test_results = require("../../../test-data-and-results/results/iceland/model1");

jest.mock("../../../../../app/utilities/pdf-helper");

describe("parseIceland1", () => {
  test.each([
    [model.validModel, test_results.validTestResult],
    [model.emptyModel, test_results.emptyTestResult],
  ])("parses model", async (testModel, expected) => {
    const result = await parser.parse(testModel, [{ not: "nothing" }]);

    expect(result).toMatchObject(expected);
  });

  test("should call logger.logError when an error is thrown", async () => {
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    await parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
