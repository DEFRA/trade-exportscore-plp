const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/nutricia/model1");
const ParserModel = require("../../../../../app/services/parser-model");
const testResults = require("../../../test-data-and-results/results/nutricia/model1");

const filename = "packinglist-nutricia-model1.xlsx";

describe("matchesNutriciaModel1", () => {
  test("matches valid Nutricia Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("matches valid Nutricia Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
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
      parserModel: ParserModel.NOMATCH,
    };
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
