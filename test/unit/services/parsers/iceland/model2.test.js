const parser = require("../../../../../app/services/parsers/iceland/model2");
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");
const testModel = require("../../../test-data-and-results/models/iceland/model2");
const testResults = require("../../../test-data-and-results/results/iceland/model2");

const logErrorSpy = jest.spyOn(logger, "logError");

describe("parseIcelandModel2", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should parse valid Iceland Model 2 CSV correctly", () => {
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
      expect.stringContaining("model2.js"),
      "parse()",
      expect.any(Error),
    );
  });
});
