// Jest mocks for CoO validation testing
jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "INELIGIBLE_ITEM_ISO",
  "GB",
  "X",
]);

jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "INELIGIBLE_ITEM_ISO",
    commodity_code: "1234",
    type_of_treatment: "Processed",
  },
]);

const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/iceland/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/iceland/model2");

const filename = "packinglist.csv";

describe("matchesIcelandModel2", () => {
  test("matches valid Iceland Model 2 CSV file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Iceland Model 2 CSV file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Iceland Model 2 CSV file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MultipleRms,
      filename,
    );

    expect(result).toMatchObject(test_results.invalidTestResult_MultipleRms);
  });

  test("matches valid Iceland Model 2 CSV file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgUnit,
      filename,
    );

    expect(result).toMatchObject(test_results.invalidTestResult_MissingKgUnit);
  });

  test("returns 'No Match' for empty model", async () => {
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: expect.stringContaining(
          "Check GB Establishment RMS Number",
        ),
      },
      items: [],
      registration_approval_number: null,
      parserModel: "no-remos",
    };

    const result = await parserService.findParser(model.emptyModel, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });
});

describe("ICELAND2 CoO Validation Tests", () => {
  test("NOT within NIRMS Scheme - passes validation", async () => {
    const result = await parserService.findParser(
      model.nonNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("Null NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.nullNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "NIRMS/Non-NIRMS goods not specified",
    );
  });

  test("Invalid NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid entry for NIRMS/Non-NIRMS goods",
    );
  });

  test("Null NIRMS value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.nullNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Invalid NIRMS value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Null CoO Value - validation errors", async () => {
    const result = await parserService.findParser(model.nullCooModel, filename);
    expect(result.business_checks.failure_reasons).toContain(
      "Missing Country of Origin",
    );
  });

  test("Invalid CoO Value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
  });

  test("Null CoO Value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.nullCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Invalid CoO Value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.invalidCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("CoO Value is X or x - passes validation", async () => {
    const result = await parserService.findParser(
      model.cooPlaceholderXModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("Item Present on Ineligible Item List (Treatment Type specified) - validation errors", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsWithTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("Item Present on Ineligible Item List, more than 3 (Treatment Type specified) - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsMultipleWithTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Item Present on Ineligible Item List (no Treatment Type specified) - validation errors", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsNoTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("Item Present on Ineligible Item List, more than 3 (no Treatment Type specified) - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsMultipleNoTreatmentModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("Valid CoO Validation: Complete packing list with all fields valid", async () => {
    const result = await parserService.findParser(
      model.validCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
    expect(result.items.every((item) => item.country_of_origin)).toBe(true);
    expect(result.items.every((item) => item.commodity_code)).toBe(true);
    expect(result.items.every((item) => item.nirms)).toBe(true);
  });
});
