const matcher = require("../../../../../app/services/matchers/asda/model4");
const matcherResult = require("../../../../../app/services/matcher-result");
const testModel = require("../../../test-data-and-results/models/asda/model4");
const logger = require("../../../../../app/utilities/logger");

const logErrorSpy = jest.spyOn(logger, "logError");
const logInfoSpy = jest.spyOn(logger, "logInfo");
const filename = "test.csv";

describe("matchesAsdaModel4", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return CORRECT for valid ASDA Model 4 CSV", () => {
    const result = matcher.matches(testModel.validModel, filename);
    expect(result).toBe(matcherResult.CORRECT);
    expect(logInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("model4.js"),
      "matches()",
      `Packing list matches Asda Model 4 CSV with filename: ${filename}`,
    );
  });

  test("should return EMPTY_FILE for empty CSV", () => {
    const result = matcher.matches(testModel.emptyModel, filename);
    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("should return WRONG_ESTABLISHMENT_NUMBER for CSV with wrong establishment number", () => {
    const result = matcher.matches(
      testModel.wrongEstablishmentNumber,
      filename,
    );
    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("should return WRONG_HEADER for CSV with wrong headers", () => {
    const result = matcher.matches(testModel.wrongHeaders, filename);
    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("should return EMPTY_FILE and log error when exception occurs", () => {
    const invalidData = null;
    const result = matcher.matches(invalidData, filename);
    expect(result).toBe(matcherResult.EMPTY_FILE);
  });
});
