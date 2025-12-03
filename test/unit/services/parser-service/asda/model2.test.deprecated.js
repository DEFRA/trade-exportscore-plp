/**
 * ASDA Model 2 parser service tests
 *
 * DEPRECATED: ASDA Model 2 format is no longer supported as of December 2025.
 * All instances now return NOMATCH. Tests remain for historical reference.
 */
require("../test-setup");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/asda/model2");

const filename = "packinglist-asda-model2.xls";

describe("matchesAsdaModel2 - DEPRECATED", () => {
  test("matches valid Asda Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Asda Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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
});
