const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-helpers/buffaload-logistics/model1/data-model");
const ParserModel = require("../../../../../app/services/parser-model");

const filename = "PackingList-Buffaload-Model-1.xlsx";

describe("matchesBuffaloadModel1", () => {
  test("matches valid Buffaload Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    console.log(filename);
    const result = parserService.findParser(
      model.validModel.Tabelle1,
      filename,
    );

    expect(result).toEqual({
      business_checks: {
        all_required_fields_present: true,
      },
      items: [],
      registration_approval_number: "RMS-GB-000098-001",
      parserModel: ParserModel.BUFFALOAD1,
    });
  });
});
