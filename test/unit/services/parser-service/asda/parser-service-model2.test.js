const ParserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-helpers/asda/model2/data-model");
const filename = "packinglist.xls";

describe("matchesAsdaModel2", () => {
  test("returns isParsed as true", () => {
    const result = ParserService.findParser(model.validModel, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid Asda Model 2 file and calls parser", () => {
    const result = ParserService.findParser(model.validModel, filename);

    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Asda Model 2 file and calls parser but all_required_fields_present is false when column empty", () => {
    const result = ParserService.findParser(model.invalidModel_MissingColumnCells, filename,);

    expect(result).toEqual(model.invalidTest_MissingCellResults);
  });
});

