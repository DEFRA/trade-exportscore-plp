const parser = require("../../../../../app/services/parsers/giovanni/model3");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/giovanni/model3");
const test_results = require("../../../test-data-and-results/results/giovanni/model3");
const { extractPdf } = require("../../../../../app/utilities/pdf-helper");

jest.mock("../../../../../app/utilities/pdf-helper", () => {
  const actual = jest.requireActual("../../../../../app/utilities/pdf-helper");
  return {
    ...actual,
    extractPdf: jest.fn(),
  };
});

describe("parse", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("parses model", async () => {
    extractPdf.mockImplementation(() => {
      return model.validModel;
    });
    const result = await parser.parse({});

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("parses model with short commodity code", async () => {
    extractPdf.mockImplementation(() => {
      return model.validModelWithShortCommodityCode;
    });
    const result = await parser.parse({});

    expect(result).toMatchObject(
      test_results.validTestResultWithShortCommodityCode,
    );
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
