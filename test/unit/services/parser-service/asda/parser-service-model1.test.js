const ParserModel = require("../../../../../app/services/parser-model");
const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-helpers/asda/model1/data-model");

const filename = "packinglist-asda-model1.xls";

describe("matchesAsdaModel1", () => {
  test("matches valid Asda Model 1 file and calls parser", () => {
    const result = ParserService.findParser(packingListJson, filename);

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000015-001",
      parserModel: ParserModel.ASDA1,
    });
    expect(result).toEqual(model.validTestResult);
  });

  test("matches valid Asda Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(model.invalidTestResults_MissingCell);
  });
});
