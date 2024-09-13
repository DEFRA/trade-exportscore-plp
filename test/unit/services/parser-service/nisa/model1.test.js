const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/nisa/model1");
const ParserModel = require("../../../../../app/services/parser-model");
const testResults = require("../../../test-data-and-results/results/nisa/model1");

const filename = "packinglist-nisa-model1.xlsx";

describe("findParser", () => {
  test("matches valid Nisa Model 1 file, calls parser and returns all_required_fields_present as true", () => {
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(testResults.validModel);
  });

  test("matches valid Nisa Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", () => {
    const result = parserService.findParser(model.missingColumnData, filename);

    expect(result).toEqual(testResults.missingColumnData);
  });

  test("wrong file extension", () => {
    const filename = "packinglist.pdf";
    const invalidModel_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: ParserModel.NOMATCH,
    };
    const result = parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidModel_NoMatch);
  });
});
