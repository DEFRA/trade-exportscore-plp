/**
 * Gousto Model 1 parser tests
 *
 * Tests for Gousto packing list data extraction and validation.
 * Covers all acceptance criteria including box number filtering,
 * NIRMS validation, and country of origin handling.
 */
const parser = require("../../../../../app/services/parsers/gousto/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/gousto/model1");
const test_results = require("../../../test-data-and-results/results/gousto/model1");

describe("parseGoustoModel1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AC2: parses valid Gousto packing list with all required fields", () => {
    const result = parser.parse(model.validModel);

    expect(result).toMatchObject(test_results.validTestResult);
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC2.1: ignores rows with box numbers", () => {
    const result = parser.parse(model.validModelWithBoxNumber);

    expect(result).toMatchObject(test_results.validTestResultWithBoxNumber);
    expect(result.items).toHaveLength(2);
    expect(
      result.items.every((item) => item.description !== "Box Contents Summary"),
    ).toBe(true);
  });

  test("AC2: extracts empty DESCRIPTION field", () => {
    const result = parser.parse(model.missingDescription);

    expect(result.items[0].description).toBe("");
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC2: validates NUMBER OF PACKS is numeric", () => {
    const result = parser.parse(model.validModel);

    result.items.forEach((item) => {
      expect(item.number_of_packages).toMatch(/^\d+$/);
    });
  });

  test("AC2: validates NET WEIGHT (KG) is numeric", () => {
    const result = parser.parse(model.validModel);

    result.items.forEach((item) => {
      expect(item.total_net_weight_kg).toMatch(/^\d+\.?\d*$/);
    });
  });

  test("AC2: extracts items even when Nature and Commodity Code missing", () => {
    const result = parser.parse(model.missingCommodityCodeAndNature);

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC4: NIRMS field is set to NIRMS with blanket statement", () => {
    const result = parser.parse(model.validModel);

    result.items.forEach((item) => {
      expect(item.nirms).toBe("NIRMS");
    });
  });

  test("AC4: NIRMS field set by blanket statement even without explicit text", () => {
    const result = parser.parse(model.missingNirmsStatement);

    result.items.forEach((item) => {
      expect(item.nirms).toBe("NIRMS");
    });
  });

  test("AC5: extracts empty Country of Origin field", () => {
    const result = parser.parse(model.missingCountryOfOrigin);

    expect(result.items[0].country_of_origin).toBe("");
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC6: accepts valid ISO 2-digit country codes", () => {
    const result = parser.parse(model.validModel);

    result.items.forEach((item) => {
      expect(item.country_of_origin).toMatch(/^[A-Z]{2}$/);
    });
  });

  test("AC6: accepts comma-separated list of country codes", () => {
    const result = parser.parse(model.multipleCountryOfOrigin);

    expect(result.items[0].country_of_origin).toBe("GB,DE,FR");
  });

  test("AC9: accepts X as Country of Origin placeholder", () => {
    const result = parser.parse(model.validCountryOfOriginPlaceholder);

    expect(result).toMatchObject(
      test_results.validCountryOfOriginPlaceholderResult,
    );
    expect(result.items[0].country_of_origin).toBe("X");
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("extracts GB Establishment RMS Number correctly", () => {
    const result = parser.parse(model.validModel);

    expect(result.registration_approval_number).toBe("RMS-GB-000483-001");
    expect(result.establishment_numbers).toContain("RMS-GB-000483-001");
  });

  test("handles multiple sheets if present", () => {
    const multiSheet = {
      Sheet1: model.validModel["Packing List"],
      Sheet2: model.validModel["Packing List"],
    };
    const result = parser.parse(multiSheet);

    expect(result.items.length).toBeGreaterThan(3);
  });

  test("logs error and returns NOMATCH on exception", () => {
    jest.spyOn(logger, "logError");
    const invalidInput = null;

    const result = parser.parse(invalidInput);

    expect(logger.logError).toHaveBeenCalled();
    expect(result).toMatchObject(test_results.noMatchResult);
  });

  test("handles empty packing list", () => {
    const result = parser.parse(model.emptyFile);

    expect(result).toMatchObject(test_results.noMatchResult);
  });

  test("preserves row location information", () => {
    const result = parser.parse(model.validModel);

    result.items.forEach((item) => {
      expect(item.row_location).toHaveProperty("rowNumber");
      expect(item.row_location).toHaveProperty("sheetName");
      expect(item.row_location.sheetName).toBe("Packing List");
    });
  });

  test("handles zero values for NUMBER OF PACKS", () => {
    const zeroPackages = {
      "Packing List": [
        { A: "GB Establishment RMS Number", B: "RMS-GB-000483-001" },
        { A: "" },
        {
          A: "DESCRIPTION",
          B: "COMMODITY CODE",
          C: "NUMBER OF PACKS",
          D: "NET WEIGHT (KG)",
          E: "NATURE",
          F: "TYPE OF TREATMENT",
          G: "COUNTRY OF ORIGIN",
        },
        {
          A: "Test Item",
          B: "1234.56.78",
          C: "0",
          D: "5.5",
          E: "Test",
          F: "Fresh",
          G: "GB",
        },
        {
          A: "",
          B: "",
          C: "",
          D: "",
          E: "All goods on this packing list are NIRMS",
        },
      ],
    };
    const result = parser.parse(zeroPackages);

    expect(result.items[0].number_of_packages).toBe("0");
  });

  test("handles zero values for NET WEIGHT", () => {
    const zeroWeight = {
      "Packing List": [
        { A: "GB Establishment RMS Number", B: "RMS-GB-000483-001" },
        { A: "" },
        {
          A: "DESCRIPTION",
          B: "COMMODITY CODE",
          C: "NUMBER OF PACKS",
          D: "NET WEIGHT (KG)",
          E: "NATURE",
          F: "TYPE OF TREATMENT",
          G: "COUNTRY OF ORIGIN",
        },
        {
          A: "Test Item",
          B: "1234.56.78",
          C: "10",
          D: "0",
          E: "Test",
          F: "Fresh",
          G: "GB",
        },
        {
          A: "",
          B: "",
          C: "",
          D: "",
          E: "All goods on this packing list are NIRMS",
        },
      ],
    };
    const result = parser.parse(zeroWeight);

    expect(result.items[0].total_net_weight_kg).toBe("0");
  });
});
