const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/cds/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/cds/model2");

const filename = "packinglist-cds-model2.xlsx";

describe("matchesCdsModel2", () => {
  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid CDS Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as false for multiple sheets", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheets,
      filename,
    );

    expect(result).toMatchObject(test_results.validTestResultForMultipleSheets);
  });

  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });

  test("matches empty CDS Model 2 file and handles empty results appropriately", async () => {
    const result = await parserService.findParser(model.emptyModel, filename);

    expect(result).toMatchObject(test_results.emptyTestResultNoRemos);
  });

  test("handles Non-NIRMS items with null country of origin correctly", async () => {
    const result = await parserService.findParser(
      model.validNonNirmsWithNullCountryOfOrigin,
      filename,
    );

    expect(result).toMatchObject(
      test_results.validTestResultWithNonNirmsNullCountryOfOrigin,
    );
  });

  test("fails validation when NIRMS item has missing country of origin", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsMissingCountryOfOrigin,
      filename,
    );

    expect(result).toMatchObject(
      test_results.invalidTestResultNirmsMissingCountryOfOrigin,
    );
  });
});
