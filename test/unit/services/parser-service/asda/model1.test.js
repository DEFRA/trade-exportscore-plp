const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model1");
const parserModel = require("../../../../../app/services/parser-model");
const testResults = require("../../../test-data-and-results/results/asda/model1");

describe("matchesAsdaModel1", () => {
  test("matches valid Asda Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const filename = "packinglist-asda-model1.xls";
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("matches valid Asda Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const filename = "packinglist-asda-model1.xls";
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(testResults.invalidTestResult_MissingCells);
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
