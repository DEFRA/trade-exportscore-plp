const parser = require("../../../../../app/services/parsers/greggs/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/greggs/model1");
const test_results = require("../../../test-data-and-results/results/greggs/model1");
const pdfHelper = require("../../../../../app/utilities/pdf-helper");
jest.mock("../../../../../app/utilities/pdf-helper");

describe("parseGreggs1", () => {
  test.each([
    [model.validModel, test_results.validTestResult],
    [model.emptyModel, test_results.emptyTestResult],
    [model.invalidModel_MissingAllRemos, test_results.validTestResult],
  ])("parses model", async (testModel, expected) => {
    pdfHelper.extractPdf.mockImplementationOnce(() => {
      return { pages: [{ content: "test content" }] };
    });

    pdfHelper.extractEstablishmentNumbers.mockImplementationOnce(() => {
      return ["RMS-GB-000021-000"];
    });

    const result = await parser.parse(testModel, [{ not: "nothing" }]);
    expect(result).toMatchObject(expected);
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
