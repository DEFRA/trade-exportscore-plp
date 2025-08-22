const parser = require("../../../../../app/services/parsers/iceland/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/iceland/model1");
const test_results = require("../../../test-data-and-results/results/iceland/model1");
const pdfHelper = require("../../../../../app/utilities/pdf-helper");
const regex = require("../../../../../app/utilities/regex");
jest.mock("../../../../../app/utilities/pdf-helper");

describe("parseIceland1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test("should process establishment numbers when sanitizedFullPackingList is provided", async () => {
    // Mock the PDF helper functions
    const mockPdfJson = { content: "test content" };
    const mockEstablishmentNumbers = ["RMS-GB-000040", "RMS-GB-000041"];

    pdfHelper.extractPdf.mockResolvedValue(mockPdfJson);
    pdfHelper.extractEstablishmentNumbersFromString.mockReturnValue(
      mockEstablishmentNumbers,
    );

    // Call parse with valid model and sanitizedFullPackingList
    const result = await parser.parse(model.validModel, [
      { test: "packinglist" },
    ]);

    // Verify PDF helper functions were called
    expect(pdfHelper.extractPdf).toHaveBeenCalledWith([
      { test: "packinglist" },
    ]);
    expect(
      pdfHelper.extractEstablishmentNumbersFromString,
    ).toHaveBeenCalledWith(mockPdfJson, expect.any(RegExp));

    // Verify establishment numbers are included in result
    expect(result.establishment_numbers).toEqual(mockEstablishmentNumbers);
  });

  test("should not process establishment numbers when sanitizedFullPackingList is not provided", async () => {
    // Call parse without sanitizedFullPackingList
    await parser.parse(model.validModel, null);

    // Verify PDF helper functions were not called
    expect(pdfHelper.extractPdf).not.toHaveBeenCalled();
    expect(
      pdfHelper.extractEstablishmentNumbersFromString,
    ).not.toHaveBeenCalled();
  });
});
