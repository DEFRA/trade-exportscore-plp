const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/asda/model1");

const filename = "packinglist-asda-model1.xls";

describe("matchesAsdaModel1", () => {
  test("matches valid Asda Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("matches valid Asda Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(test_results.invalidTestResult_MissingCells);
  });

  test("returns 'No Match' for incorrect file extension", async () => {
    const filename = "packinglist.pdf";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: "No GB Establishment RMS Number",
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
