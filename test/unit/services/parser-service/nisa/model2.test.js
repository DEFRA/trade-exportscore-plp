// ⚠️ CRITICAL: Top-level mocks (hoisted properly)
jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
  "GB",
  "X",
  "IE",
  "FR",
  "DE",
]);

jest.mock("../../../../../app/services/data/data-prohibited-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "1234",
    type_of_treatment: "Processed",
  },
]);

const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/nisa/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/nisa/model2");

const filename = "packinglist-nisa-model2.xlsx";

describe("matchesNisaModel2", () => {
  test("matches valid Nisa Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Nisa Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Nisa Model 2 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid Nisa Model 2 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });
});

describe("Nisa 2 CoO Validation Tests - Type 1", () => {
  // Valid CoO validation - happy path
  test("Valid packing list with conventional NIRMS values - passes all validation", async () => {
    const result = await parserService.findParser(
      model.validCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
    expect(result.items.every((item) => item.country_of_origin)).toBe(true);
    expect(result.items.every((item) => item.commodity_code)).toBe(true);
    expect(result.items.every((item) => item.nirms)).toBe(true);
  });

  // BAC1: NOT within NIRMS Scheme - passes validation
  test("BAC1: NOT within NIRMS Scheme - passes validation", async () => {
    const result = await parserService.findParser(
      model.nonNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  // BAC2: Null NIRMS value - validation errors
  test("BAC2: Null NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.nullNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "NIRMS/Non-NIRMS goods not specified",
    );
  });

  // BAC3: Invalid NIRMS value - validation errors
  test("BAC3: Invalid NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid entry for NIRMS/Non-NIRMS goods",
    );
  });

  // BAC4: Null NIRMS value, more than 3 - multiple validation errors
  test("BAC4: Null NIRMS value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.nullNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  // BAC5: Invalid NIRMS value, more than 3 - multiple validation errors
  test("BAC5: Invalid NIRMS value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  // BAC6: Null CoO Value - validation errors
  test("BAC6: Null CoO Value - validation errors", async () => {
    const result = await parserService.findParser(model.nullCooModel, filename);
    expect(result.business_checks.failure_reasons).toContain(
      "Missing Country of Origin",
    );
  });

  // BAC7: Invalid CoO Value - validation errors
  test("BAC7: Invalid CoO Value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
  });

  // BAC8: Null CoO Value, more than 3 - multiple validation errors
  test("BAC8: Null CoO Value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.nullCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  // BAC9: Invalid CoO Value, more than 3 - multiple validation errors
  test("BAC9: Invalid CoO Value, more than 3 - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  // BAC10: CoO Placeholder X - passes validation
  test("BAC10: CoO Placeholder X - passes validation", async () => {
    const result = await parserService.findParser(model.xCooModel, filename);
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  // BAC11: Prohibited Item with Treatment Type - validation errors
  test("BAC11: Prohibited Item with Treatment Type - validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  // BAC12: Prohibited Items, more than 3 (Treatment Type specified) - multiple validation errors
  test("BAC12: Prohibited Items, more than 3 (Treatment Type specified) - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsMultipleWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  // BAC13: Prohibited Item without Treatment Type - validation errors
  test("BAC13: Prohibited Item without Treatment Type - validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsWithoutTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  // BAC14: Prohibited Items, more than 3 (no Treatment Type specified) - multiple validation errors
  test("BAC14: Prohibited Items, more than 3 (no Treatment Type specified) - multiple validation errors", async () => {
    const result = await parserService.findParser(
      model.prohibitedItemsMultipleWithoutTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });
});
