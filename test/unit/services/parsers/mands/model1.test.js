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

describe("findNetWeightUnit", () => {
  test("should find the net weight unit from the header", () => {
    const header = "Tot Net Weight kg Tot Gross Weight kg";
    const result = parser.findNetWeightUnit(header);
    expect(result).toBe("kg");
  });

  test("should find the net weight unit from the header without gross weight", () => {
    const header = "Tot Net Weight kg";
    const result = parser.findNetWeightUnit(header);
    expect(result).toBe("kg");
  });

  test("should find the net weight unit from the header without gross weight kg", () => {
    const header = "Tot Net Weight kg gross weight";
    const result = parser.findNetWeightUnit(header);
    expect(result).toBe("kg");
  });

  test("should return null if no valid unit is found", () => {
    const header = "Tot Net Weight";

    const result = parser.findNetWeightUnit(header);
    expect(result).toBeNull();
  });

  test("shouldn't return gross weight kg", () => {
    const header = "tot Net Weight (other string) Tot Gross Weight kg";
    const result = parser.findNetWeightUnit(header);
    expect(result).toBeNull();
  });

  test("shouldn't return gross weight kg for any characters", () => {
    const header = "tot Net Weight 5tgif20 Tot Gross Weight kg";
    const result = parser.findNetWeightUnit(header);
    expect(result).toBeNull();
  });
});
