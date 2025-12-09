const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/bandm/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/bandm/model1");
const failureReasons = require("../../../../../app/services/validators/packing-list-failure-reasons");

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "INELIGIBLE_ITEM_ISO",
  "GB",
  "X",
]);
jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "INELIGIBLE_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "Processed",
  },
]);

const filename = "packinglist-bandm-model1.xlsx";

describe("matchesBAndMModel1", () => {
  test("matches valid BAndM Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid BAndM Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid BAndM Model 1 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid BAndM Model 1 file file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });

  // AC1: Null NIRMS value - Given a packing list does not have the statement 'This consignment contains only NIRMS eligible goods' specified anywhere on it
  test("AC1: matches BAndM Model 1 file, returns all_required_fields_present as false for missing NIRMS statement", async () => {
    const result = await parserService.findParser(
      model.missingNirmsStatement,
      filename,
    );

    expect(result).toMatchObject(test_results.missingNirmsStatementTestResult);
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.NIRMS_MISSING,
    );
  });

  // AC2: Null CoO Value - Given a packing list has the NIRMS statement and the CoO value is null
  test("AC2: matches BAndM Model 1 file, returns all_required_fields_present as false for null CoO value", async () => {
    const result = await parserService.findParser(model.nullCoO, filename);

    expect(result).toMatchObject(test_results.nullCoOTestResult);
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.COO_MISSING,
    );
  });

  // AC3: Invalid CoO Value - Given a packing list has the NIRMS statement and the CoO value is not valid
  test("AC3: matches BAndM Model 1 file, returns all_required_fields_present as false for invalid CoO value", async () => {
    const result = await parserService.findParser(model.invalidCoO, filename);

    expect(result).toMatchObject(test_results.invalidCoOTestResult);
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.COO_INVALID,
    );
  });

  // AC4: Null CoO Value, more than 3 - Multiple items with null CoO values
  test("AC4: matches BAndM Model 1 file, returns all_required_fields_present as false for multiple null CoO values", async () => {
    const result = await parserService.findParser(
      model.multipleNullCoO,
      filename,
    );

    expect(result).toMatchObject(test_results.multipleNullCoOTestResult);
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.COO_MISSING,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "in addition to 2 other locations",
    );
  });

  // AC5: Invalid CoO Value, more than 3 - Multiple items with invalid CoO values
  test("AC5: matches BAndM Model 1 file, returns all_required_fields_present as false for multiple invalid CoO values", async () => {
    const result = await parserService.findParser(
      model.multipleInvalidCoO,
      filename,
    );

    expect(result).toMatchObject(test_results.multipleInvalidCoOTestResult);
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.COO_INVALID,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "in addition to 2 other locations",
    );
  });

  // AC6: CoO Value is X or x - Should pass when country of origin is "X" or "x"
  test("AC6: matches BAndM Model 1 file, returns all_required_fields_present as true for CoO value X or x", async () => {
    const result = await parserService.findParser(model.xCoO, filename);

    expect(result).toMatchObject(test_results.xCoOTestResult);
    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.business_checks.failure_reasons).toBe(null);
  });

  // AC7: Item Present on Ineligible Item List (Treatment Type specified)
  test("AC7: matches BAndM Model 1 file, returns all_required_fields_present as false for ineligible item with treatment type", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemWithTreatment,
      filename,
    );

    expect(result).toMatchObject(
      test_results.ineligibleItemWithTreatmentTestResult,
    );
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.INELIGIBLE_ITEM,
    );
  });

  // AC8: Item Present on Ineligible Item List, more than 3 (Treatment Type specified)
  test("AC8: matches BAndM Model 1 file, returns all_required_fields_present as false for multiple ineligible items with treatment type", async () => {
    const result = await parserService.findParser(
      model.multipleineligibleItemsWithTreatment,
      filename,
    );

    expect(result).toMatchObject(
      test_results.multipleineligibleItemsWithTreatmentTestResult,
    );
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.INELIGIBLE_ITEM,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "in addition to 2 other locations",
    );
  });

  // AC9: Item Present on Ineligible Item List (no Treatment Type specified)
  test("AC9: matches BAndM Model 1 file, returns all_required_fields_present as false for ineligible item without treatment type", async () => {
    const result = await parserService.findParser(
      model.ineligibleItemNoTreatment,
      filename,
    );

    expect(result).toMatchObject(
      test_results.ineligibleItemNoTreatmentTestResult,
    );
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.INELIGIBLE_ITEM,
    );
  });

  // AC10: Item Present on Ineligible Item List, more than 3 (no Treatment Type specified)
  test("AC10: matches BAndM Model 1 file, returns all_required_fields_present as false for multiple ineligible items without treatment type", async () => {
    const result = await parserService.findParser(
      model.multipleineligibleItemsNoTreatment,
      filename,
    );

    expect(result).toMatchObject(
      test_results.multipleineligibleItemsNoTreatmentTestResult,
    );
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.INELIGIBLE_ITEM,
    );
    expect(result.business_checks.failure_reasons).toContain(
      "in addition to 2 other locations",
    );
  });

  // AC11: Null Treatment type value - Missing treatment type statement with null commodity code
  test("AC11: matches BAndM Model 1 file, returns all_required_fields_present as false for null treatment type with null identifier", async () => {
    const result = await parserService.findParser(
      model.nullTreatmentTypeWithNullIdentifier,
      filename,
    );

    expect(result).toMatchObject(
      test_results.nullTreatmentTypeWithNullIdentifierTestResult,
    );
    expect(result.business_checks.failure_reasons).toContain(
      failureReasons.IDENTIFIER_MISSING,
    );
  });

  test("matches valid BAndM Model 1 file with multiple sheets where headers are on different rows", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(4);
    expect(result.items[1].row_location.rowNumber).toBe(5);
  });
});
