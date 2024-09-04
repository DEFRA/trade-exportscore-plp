const parserService = require("../../../../../../app/services/parser-service");
const model = require("../../../../test-helpers/warrens/model1/data-model");

const filename = "packinglist.xlsx";

describe("matchesWarrensModel1", () => {
  test("matches valid Warrens Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result.registration_approval_number).toEqual(
      model.validTestResult.registration_approval_number,
    );
    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Warrens Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(model.invalidTestResult_MissingCells);
  });
});
