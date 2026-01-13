const parser = require("../../../../../app/services/parsers/mands/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/mands/model1");
const test_results = require("../../../test-data-and-results/results/mands/model1");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");

jest.mock("../../../../../app/utilities/pdf-helper", () => {
  const actual = jest.requireActual("../../../../../app/utilities/pdf-helper");
  return {
    ...actual,
    extractPdf: jest.fn(),
  };
});

describe("parseMandS1", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [model.validModel, test_results.validTestResult],
    [model.emptyModel, test_results.emptyTestResult],
  ])("parses model", async (testModel, expected) => {
    extractPdf.mockImplementation(() => {
      return testModel;
    });
    const result = await parser.parse({});

    expect(result).toMatchObject(expected);
  });

  test("should call logger.logError when an error is thrown", async () => {
    extractPdf.mockImplementation(() => {
      throw new Error();
    });
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    await parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
