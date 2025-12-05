require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/fowlerwelch/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/fowlerwelch/model2");

const filename = "packinglist.xlsx";

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
  "GB",
  "X",
]);

jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "1234",
    type_of_treatment: "Processed",
  },
]);

describe("matchesFowlerwelchModel2", () => {
  test("matches valid Fowlerwelch Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Fowlerwelch Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Fowlerwelch Model 2 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid Fowlerwelch Model 2 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });
});

describe("Fowlerwelch 2 CoO Validation Tests", () => {
  test("BAC1: NOT within NIRMS Scheme - passes validation", async () => {
    const result = await parserService.findParser(
      model.nonNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("BAC2: Null NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.nullNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "NIRMS/Non-NIRMS goods not specified",
    );
  });

  test("BAC3: Invalid NIRMS value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid entry for NIRMS/Non-NIRMS goods",
    );
  });

  test("BAC4: Null NIRMS value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.nullNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC5: Invalid NIRMS value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC6: Null CoO Value - validation errors", async () => {
    const result = await parserService.findParser(model.nullCooModel, filename);
    expect(result.business_checks.failure_reasons).toContain(
      "Missing Country of Origin",
    );
  });

  test("BAC7: Invalid CoO Value - validation errors", async () => {
    const result = await parserService.findParser(
      model.invalidCooModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Invalid Country of Origin ISO Code",
    );
  });

  test("BAC8: Null CoO Value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.nullCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC9: Invalid CoO Value, more than 3 - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.invalidCooMultipleModel,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC10: CoO Value is X or x - passes validation", async () => {
    const result = await parserService.findParser(model.xCoO, filename);
    expect(result.business_checks.failure_reasons).toBeNull();
  });

  test("BAC11: Item Present on Prohibited Item List (Treatment Type specified) - validation errors", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("BAC12: Item Present on Prohibited Item List, more than 3 (Treatment Type specified) - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsMultipleWithTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain("in addition to");
  });

  test("BAC13: Item Present on Prohibited Item List (no Treatment Type specified) - validation errors", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsNoTreatment,
      filename,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "Prohibited item identified on the packing list",
    );
  });

  test("BAC14: Item Present on Prohibited Item List, more than 3 (no Treatment Type specified) - validation errors with summary", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemsMultipleNoTreatment,
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
