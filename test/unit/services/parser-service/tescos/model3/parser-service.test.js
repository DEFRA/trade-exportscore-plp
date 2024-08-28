const parserService = require("../../../../../../app/services/parser-service");
const model = require("../../../../test-helpers/tescos/model3/data-model");

const filename = "PackingListTesco3.xlsx";

describe("matchesTescosModel3", () => {
  test("matches valid Tescos Model 3 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Tescos Model 3 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(model.invalidTestResult_MissingCells);
  });
});
