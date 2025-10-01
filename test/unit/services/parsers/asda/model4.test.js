const parser = require("../../../../../app/services/parsers/asda/model4");
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");
const testModel = require("../../../test-data-and-results/models/asda/model4");
const testResults = require("../../../test-data-and-results/results/asda/model4");

const logErrorSpy = jest.spyOn(logger, "logError");

describe("parseAsdaModel4", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should parse valid ASDA Model 4 CSV correctly", () => {
    const result = parser.parse(testModel.validModel);
    expect(result).toMatchObject(testResults.validTestResult);
  });

  test("should return NOMATCH for empty CSV", () => {
    const result = parser.parse(testModel.emptyModel);
    expect(result.parserModel).toBe(parserModel.NOMATCH);
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("should return NOMATCH for CSV with missing required data", () => {
    const result = parser.parse(testModel.invalidModel);
    expect(result.parserModel).toBe(parserModel.NOMATCH);
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("should handle parsing errors gracefully", () => {
    const result = parser.parse(null);
    expect(result.parserModel).toBe(parserModel.NOMATCH);
    expect(logErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("model4.js"),
      "parse()",
      expect.any(Error),
    );
  });
});
