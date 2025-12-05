require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/giovanni/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/giovanni/model1");

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
  "GB",
  "CN",
  "IT",
  "DE",
  "FR",
  "ES",
  "US",
]);
jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "PROHIBITED_ITEM_TREATMENT",
  },
]);

const filename = "packinglist-giovanni-model1.xlsx";

describe("matchesGiovanniModel1", () => {
  test("matches valid Giovanni Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Giovanni Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toMatchObject(test_results.invalidTestResult_MissingCells);
  });

  test("returns 'No Match' for incorrect file extension", async () => {
    const filename = "packinglist.wrong";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: null,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };

    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });

  test("matches valid Giovanni Model 1 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid Giovanni Model 1 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });
});

// CoO Validation Tests - AB#591527
describe("GIOVANNI1 CoO Validation Tests - Type 4", () => {
  test("BAC1: Missing dynamic blanket statement - validation fails", async () => {
    const result = await parserService.findParser(
      model.missingBlanketStatement,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "NIRMS/Non-NIRMS goods not specified",
    );
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("BAC2: Missing CoO values with blanket statement - validation errors", async () => {
    const result = await parserService.findParser(
      model.missingCooValues,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Missing Country of Origin",
    );
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("BAC3: Invalid CoO format - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooFormat,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test('BAC4-5: Multiple CoO errors aggregation - shows first 3 and "in addition to" message', async () => {
    const result = await parserService.findParser(
      model.multipleCooErrors,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("BAC6: Valid packing list with dynamic blanket statement passes validation", async () => {
    const result = await parserService.findParser(
      model.validCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("BAC6: CoO placeholder X/x values pass validation", async () => {
    const result = await parserService.findParser(
      model.cooPlaceholderX,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
    expect(result.business_checks.all_required_fields_present).toBe(true);
  });

  test("Dynamic blanket statement sets all items to NIRMS", async () => {
    const result = await parserService.findParser(
      model.validCooModel,
      filename,
    );
    expect(result.items.every((item) => item.nirms === "NIRMS")).toBe(true);
  });

  test("BAC7: Prohibited items validation with treatment type", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test('BAC8,10: Multiple prohibited items aggregation - shows first 3 and "in addition to" message', async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsMultiple,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });

  test("BAC9: Prohibited items validation without treatment type", async () => {
    const result = await parserService.findParser(
      model.ineligibleItems,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
    expect(result.business_checks.all_required_fields_present).toBe(false);
  });
});
