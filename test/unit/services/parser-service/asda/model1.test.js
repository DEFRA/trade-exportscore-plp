const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/asda/model1");

describe("matchesAsdaModel1", () => {
  test("matches valid Asda Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const filename = "packinglist-asda-model1.xls";
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("matches valid Asda Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    const filename = "packinglist-asda-model1.xls";
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(test_results.invalidTestResult_MissingCells);
  });

  test("wrong file extension", async () => {
    const filename = "packinglist.pdf";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parser_model.NOMATCH,
    };
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
