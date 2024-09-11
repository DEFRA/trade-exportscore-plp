const parserService = require("../../../../../../app/services/parser-service");
const model = require("../../../../test-helpers/asda/model1/data-model");
const ParserModel = require("../../../../../../app/services/parser-model");

describe("matchesAsdaModel1", () => {
  test("matches valid Asda Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const filename = "packinglist-asda-model1.xls";
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Asda Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const filename = "packinglist-asda-model1.xls";
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(model.invalidTestResult_MissingCells);
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
