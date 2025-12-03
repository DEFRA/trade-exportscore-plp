require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/nutricia/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/nutricia/model2");
const failureReasonsDescriptions = require("../../../../../app/services/validators/packing-list-failure-reasons");

const filename = "packinglist-nutricia-model2.xlsx";

describe("matchesNutriciaModel2", () => {
  test("matches valid Nutricia Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(
      model.modelWithNoUnitInHeader,
      filename,
    );

    expect(result).toMatchObject(test_results.invalidTestResultWithNoHeader);
  });

  test("matches valid Nutricia Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Nutricia Model 2 file", async () => {
    const result = await parserService.findParser(model.matchModel, filename);

    expect(result.parserModel).toBe(parserModel.NUTRICIA2);
  });

  test("return check rms establishment number", async () => {
    const result = await parserService.findParser(
      model.hasSupplierButNotRms,
      filename,
    );

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.MISSING_REMOS,
    );
    expect(result.parserModel).toBe(parserModel.NOREMOS);
  });

  test("return no match when contains rms number but not supplier", async () => {
    const result = await parserService.findParser(
      model.hasRmsButNotSupplier,
      filename,
    );

    expect(result.parserModel).toBe(parserModel.NOMATCH);
  });

  test("returns multiple rms numbers failure reason", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result.business_checks.failure_reasons).toBe(
      failureReasonsDescriptions.MULTIPLE_RMS,
    );
  });

  test("matches valid Nutricia Model 2 file with multiple sheets where headers are on different rows", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(3);
    expect(result.items[1].row_location.rowNumber).toBe(4);
  });
});
