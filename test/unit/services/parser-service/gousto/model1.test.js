/**
 * Gousto Model 1 parser service tests
 *
 * Integration tests for Gousto packing list processing through
 * the parser service, including matcher integration and business
 * rule validation.
 */
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/gousto/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/gousto/model1");

const filename = "GoustoPackingList.xlsx";

describe("matchesGoustoModel1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AC1 & AC2: matches valid Gousto file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
    expect(result.parserModel).toBe(parserModel.GOUSTO1);
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC2.1: matches file with box numbers and filters them out", async () => {
    const result = await parserService.findParser(
      model.validModelWithBoxNumber,
      filename,
    );

    expect(result).toMatchObject(test_results.validTestResultWithBoxNumber);
    expect(result.items).toHaveLength(2);
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC3: returns all_required_fields_present as false when description is missing", async () => {
    const result = await parserService.findParser(
      model.missingDescription,
      filename,
    );

    expect(result.items[0].description).toBeNull();
    expect(result.business_checks.all_required_fields_present).toBe(false);
    expect(result.business_checks.failure_reasons).toContain(
      "Product description is missing",
    );
  });

  test("AC3: returns all_required_fields_present as false when commodity code and nature missing", async () => {
    const result = await parserService.findParser(
      model.missingCommodityCodeAndNature,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("AC5: returns all_required_fields_present as false when Country of Origin is missing", async () => {
    const result = await parserService.findParser(
      model.missingCountryOfOrigin,
      filename,
    );

    expect(result.items[0].country_of_origin).toBeNull();
    expect(result.business_checks.all_required_fields_present).toBe(false);
    expect(result.business_checks.failure_reasons).toContain(
      "Missing Country of Origin",
    );
  });

  test("AC6: returns all_required_fields_present as false for invalid Country of Origin", async () => {
    const result = await parserService.findParser(
      model.invalidCountryOfOrigin,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("AC9: accepts X as valid Country of Origin placeholder", async () => {
    const result = await parserService.findParser(
      model.validCountryOfOriginPlaceholder,
      filename,
    );

    expect(result).toMatchObject(
      test_results.validCountryOfOriginPlaceholderResult,
    );
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("AC9: rejects x (lowercase) as invalid Country of Origin", async () => {
    const lowercaseX = {
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
          D: "5.5",
          E: "Test",
          F: "Fresh",
          G: "x",
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
    const result = await parserService.findParser(lowercaseX, filename);

    expect(result.items[0].country_of_origin).toBe("x");
    expect(result.business_checks.all_required_fields_present).toBe(false);
    // Note: lowercase x not accepted - generates validation errors
  });

  test("accepts comma-separated list of valid ISO country codes", async () => {
    const result = await parserService.findParser(
      model.multipleCountryOfOrigin,
      filename,
    );

    expect(result.items[0].country_of_origin).toBe("GB,DE,FR");
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("does not match when establishment number is wrong", async () => {
    const result = await parserService.findParser(
      model.wrongEstablishmentNumber,
      filename,
    );

    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });

  test("does not match when required headers are missing", async () => {
    const result = await parserService.findParser(
      model.missingHeaders,
      filename,
    );

    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });

  test("does not match empty file", async () => {
    const result = await parserService.findParser(model.emptyFile, filename);

    expect(result.parserModel).toBe("no-remos");
  });

  test("AC4: NIRMS field is null when blanket statement is missing", async () => {
    const result = await parserService.findParser(
      model.missingNirmsStatement,
      filename,
    );

    result.items.forEach((item) => {
      expect(item.nirms).toBeNull();
    });
  });

  test("extracts all establishment numbers from packing list", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result.establishment_numbers).toContain("RMS-GB-000483-001");
    expect(result.registration_approval_number).toBe("RMS-GB-000483-001");
  });

  test("handles packing list with table information above data", async () => {
    const withTable = {
      "Packing List": [
        { A: "Company:", B: "Gousto Ltd" },
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
          G: "COUNTRY OF ORIGIN",
        },
        {
          A: "Test Item",
          B: "1234.56.78",
          C: "10",
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
    const result = await parserService.findParser(withTable, filename);

    expect(result.parserModel).toBe(parserModel.GOUSTO1);
    expect(result.items[0].description).toBe("Test Item");
    expect(result.items[0].country_of_origin).toBe("GB");
    // Note: may fail validation due to commodity code format or other business rules
  });
});
