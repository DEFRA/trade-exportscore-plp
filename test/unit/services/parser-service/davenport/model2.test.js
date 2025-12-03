require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/davenport/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/davenport/model2");
const failureReasons = require("../../../../../app/services/validators/packing-list-failure-reasons");

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
]);
jest.mock("../../../../../app/services/data/data-prohibited-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "709200010",
    type_of_treatment: "PROHIBITED_ITEM_TREATMENT",
  },
]);

const filename = "packinglist-davenport-model2.xlsx";

describe("matchesDavenportModel2", () => {
  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Davenport Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid Davenport Model 2 file file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });
  test("returns 'No Match' when 'Commodity Code' header is missing", async () => {
    const filename = "packinglist-davenport-model2.xlsx";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: null,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };

    const result = await parserService.findParser(
      model.missingCommodityCodeHeader,
      filename,
    );

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as false for invalid NIRMS", async () => {
    const result = await parserService.findParser(model.invalidNirms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasons.NIRMS_INVALID + ' in sheet "Revised" row 3.\n',
    );
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as true for valid NIRMS", async () => {
    const result = await parserService.findParser(model.nonNirms, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as false for missing NIRMS", async () => {
    const result = await parserService.findParser(model.missingNirms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasons.NIRMS_MISSING + ' in sheet "Revised" row 3.\n',
    );
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as false for missing CoO", async () => {
    const result = await parserService.findParser(model.missingCoO, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasons.COO_MISSING + ' in sheet "Revised" row 3.\n',
    );
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as false for invalid CoO", async () => {
    const result = await parserService.findParser(model.invalidCoO, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasons.COO_INVALID + ' in sheet "Revised" row 3.\n',
    );
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as true for X CoO", async () => {
    const result = await parserService.findParser(model.validXCoO, filename);

    expect(result.business_checks.all_required_fields_present).toBeTruthy();
  });

  test("matches valid Davenport Model 2 file, calls parser and returns all_required_fields_present as false for prohibited items", async () => {
    const result = await parserService.findParser(
      model.ineligibleItems,
      filename,
    );

    expect(result.business_checks.failure_reasons).toBe(
      failureReasons.PROHIBITED_ITEM +
        ' in sheet "Revised" row 3 and sheet "Revised" row 4.\n',
    );
  });

  test("matches valid Davenport Model 2 file with multiple sheets where headers are on different rows, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(3);
    expect(result.items[1].row_location.rowNumber).toBe(4);
  });
});
