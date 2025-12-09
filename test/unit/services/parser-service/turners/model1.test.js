const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/turners/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/turners/model1");
const failureReasons = require("../../../../../app/services/validators/packing-list-failure-reasons");

const filename = "packinglist-turners-model1.xlsx";

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "IE",
  "GB",
  "VALID_ISO",
  "INELIGIBLE_ITEM_ISO",
]);
jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "INELIGIBLE_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "INELIGIBLE_ITEM_TREATMENT",
  },
]);

describe("matchesTurnersModel1", () => {
  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid TURNERS Model 1 file with multiple sheets, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheets,
      filename,
    );

    expect(result).toMatchObject(test_results.validTestResultForMultipleSheets);
  });

  test("matches valid TURNERS Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toMatchObject(
      test_results.invalidTestResult_MissingColumnCells,
    );
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

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for invalid NIRMS", async () => {
    const result = await parserService.findParser(model.invalidNirms, filename);

    expect(result).toMatchObject(test_results.invalidNirmsTestResult);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as true for valid non-NIRMS", async () => {
    const result = await parserService.findParser(model.nonNirms, filename);

    expect(result).toMatchObject(test_results.nonNirmsTestResult);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for missing NIRMS", async () => {
    const result = await parserService.findParser(model.missingNirms, filename);

    expect(result).toMatchObject(test_results.missingNirmsTestResult);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for missing CoO", async () => {
    const result = await parserService.findParser(model.missingCoO, filename);

    expect(result).toMatchObject(test_results.missingCoOTestResult);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for invalid CoO", async () => {
    const result = await parserService.findParser(model.invalidCoO, filename);

    expect(result).toMatchObject(test_results.invalidCoOTestResult);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as true for X CoO", async () => {
    const result = await parserService.findParser(model.xCoO, filename);

    expect(result).toMatchObject(test_results.xCoOTestResult);
  });

  test("matches valid TURNERS Model 1 file, calls parser and returns all_required_fields_present as false for ineligible items", async () => {
    const result = await parserService.findParser(
      model.ineligibleItems,
      filename,
    );

    expect(result).toMatchObject(test_results.ineligibleItemsTestResult);
  });
});
