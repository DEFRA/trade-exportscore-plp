const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-helpers/bandm/model1/data-model");
const ParserModel = require("../../../../../app/services/parser-model");
const ParserService = require("../../../../../app/services/parser-service");

const filename = "packinglist-bandm-model1.xlsx";

describe("matchesBAndMModel1", () => {
  test("returns isParsed as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result.isParsed).toBeTruthy();
  });

  test("matches valid BAndM Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid BAndM Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(model.invalidTestResult_MissingCells);

    test("matches valid BAndM Model 1 file and calls parser", () => {
      const result = ParserService.findParser(packingListJson, filename);

      expect(result).toEqual({
        business_checks: {
          all_required_fields_present: true,
        },
        items: [],
        registration_approval_number: "RMS-GB-000005-001",
        parserModel: ParserModel.BANDM1,
      });
    });
  });
});
