const parserService = require("../../../../../../app/services/parser-service");
const model = require("../../../../test-helpers/nutricia/model1/data-model");

const filename = "packinglist-nutricia-model1.xlsx";

describe("matchesNutriciaModel1", () => {
  test("matches valid Nutricia Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Nutricia Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(model.invalidTestResult_MissingCells);
  });
});
