/**
 * Gousto Model 1 matcher tests
 *
 * Tests for Gousto packing list format detection via establishment
 * number and header row validation.
 */
const matcher = require("../../../../../app/services/matchers/gousto/model1");
const matcherResult = require("../../../../../app/services/matcher-result");
const model = require("../../../test-data-and-results/models/gousto/model1");
const logger = require("../../../../../app/utilities/logger");

const filename = "GoustoPackingList.xlsx";

describe("matchesGoustoModel1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AC1: returns Correct for valid Gousto packing list", () => {
    const result = matcher.matches(model.validModel, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns Correct when headers are in different order", () => {
    const reorderedHeaders = {
      "Packing List": [
        { A: "GB Establishment RMS Number", B: "RMS-GB-000483-001" },
        { A: "" },
        {
          A: "NUMBER OF PACKS",
          B: "DESCRIPTION",
          C: "NET WEIGHT (KG)",
          D: "COMMODITY CODE",
          E: "NATURE",
          F: "TYPE OF TREATMENT",
          G: "COUNTRY OF ORIGIN",
        },
        {
          A: "10",
          B: "Fresh Salmon",
          C: "5.5",
          D: "0302.12.00",
          E: "Fish",
          F: "Chilled",
          G: "GB",
        },
      ],
    };
    const result = matcher.matches(reorderedHeaders, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("returns 'Empty File' matcher result for empty json", () => {
    const result = matcher.matches(model.emptyFile, filename);

    expect(result).toBe(matcherResult.EMPTY_FILE);
  });

  test("returns 'Wrong Establishment Number' for incorrect RMS number", () => {
    const result = matcher.matches(model.wrongEstablishmentNumber, filename);

    expect(result).toBe(matcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns 'Wrong Header' when required headers are missing", () => {
    const result = matcher.matches(model.missingHeaders, filename);

    expect(result).toBe(matcherResult.WRONG_HEADER);
  });

  test("logs error and returns 'Generic Error' on exception", () => {
    jest.spyOn(logger, "logError");
    const invalidInput = null;

    const result = matcher.matches(invalidInput, filename);

    expect(logger.logError).toHaveBeenCalled();
    expect(result).toBe(matcherResult.GENERIC_ERROR);
  });

  test("accepts establishment number with hyphenated suffix (RMS-GB-000483-XXX)", () => {
    const withSuffix = {
      "Packing List": [
        { A: "GB Establishment RMS Number", B: "RMS-GB-000483-123" },
        { A: "" },
        {
          A: "DESCRIPTION",
          B: "COMMODITY CODE",
          C: "NUMBER OF PACKS",
          D: "NET WEIGHT (KG)",
          E: "NATURE",
          F: "TYPE OF TREATMENT",
        },
        {
          A: "Test Item",
          B: "1234.56.78",
          C: "5",
          D: "2.5",
          E: "Test",
          F: "Fresh",
        },
      ],
    };
    const result = matcher.matches(withSuffix, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });

  test("handles packing list with table information above data", () => {
    const withTableAbove = {
      "Packing List": [
        { A: "Supplier:", B: "Gousto Ltd" },
        { A: "Address:", B: "123 Test Street" },
        { A: "Date:", B: "15/12/2025" },
        { A: "GB Establishment RMS Number", B: "RMS-GB-000483-001" },
        { A: "" },
        {
          A: "DESCRIPTION",
          B: "COMMODITY CODE",
          C: "NUMBER OF PACKS",
          D: "NET WEIGHT (KG)",
          E: "NATURE",
          F: "TYPE OF TREATMENT",
        },
        {
          A: "Test Item",
          B: "1234.56.78",
          C: "5",
          D: "2.5",
          E: "Test",
          F: "Fresh",
        },
      ],
    };
    const result = matcher.matches(withTableAbove, filename);

    expect(result).toBe(matcherResult.CORRECT);
  });
});
