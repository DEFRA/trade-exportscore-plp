const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/co-op/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/co-op/model1");

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "HIGH_RISK_ISO",
]);
jest.mock(
  "../../../../../app/services/data/data-high-risk-products.json",
  () => [
    {
      country_of_origin: "HIGH_RISK_ISO",
      commodity_code: "012",
      type_of_treatment: "HIGH_RISK_TREATMENT",
    },
  ],
);

const filename = "packinglist-co-op-model1.xlsx";

describe("matchesCoopModel1", () => {
  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Co-op Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for invalid NIRMS", async () => {
    const result = await parserService.findParser(model.invalidNirms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      'Invalid entry for NIRMS/Non-NIRMS goods in sheet "Input Packing Sheet" row 2.\n',
    );
  });

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for missing NIRMS", async () => {
    const result = await parserService.findParser(model.missingNirms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      'NIRMS/Non-NIRMS goods not specified in sheet "Input Packing Sheet" row 2.\n',
    );
  });

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for missing CoO", async () => {
    const result = await parserService.findParser(model.missingCoO, filename);

    expect(result.business_checks.failure_reasons).toBe(
      'Missing Country of Origin in sheet "Input Packing Sheet" row 2, sheet "Input Packing Sheet" row 3, sheet "Input Packing Sheet" row 4 in addition to 2 other locations.\n',
    );
  });

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for invalid CoO", async () => {
    const result = await parserService.findParser(model.invalidCoO, filename);

    expect(result.business_checks.failure_reasons).toBe(
      'Invalid Country of Origin in sheet "Input Packing Sheet" row 2, sheet "Input Packing Sheet" row 3, sheet "Input Packing Sheet" row 4 in addition to 2 other locations.\n',
    );
  });

  test("matches valid Co-op Model 1 file, calls parser and returns all_required_fields_present as false for high risk products", async () => {
    const result = await parserService.findParser(
      model.highRiskProducts,
      filename,
    );

    expect(result.business_checks.failure_reasons).toBe(
      'High risk item identified on the packing list in sheet "Input Packing Sheet" row 2 and sheet "Input Packing Sheet" row 4.\n',
    );
  });
});
