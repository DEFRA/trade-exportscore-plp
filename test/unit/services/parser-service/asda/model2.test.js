const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/asda/model2");

const filename = "packinglist-asda-model2.xls";

describe("matchesAsdaModel2", () => {
  test("matches valid Asda Model 2 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("matches valid Asda Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(test_results.invalidTestResult_MissingCells);
  });

  test("wrong file extension", () => {
    const filename = "packinglist.pdf";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
