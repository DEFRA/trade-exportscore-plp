const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/giovanni/model1");
const parser_model = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/giovanni/model1");

const filename = "packinglist-giovanni-model1.xlsx";

describe("matchesGiovanniModel1", () => {
  test("matches valid Giovanni Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("matches valid Giovanni Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toEqual(test_results.invalidTestResult_MissingCells);
  });

  test("wrong file extension", async () => {
    const filename = "packinglist.pdf";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parser_model.NOMATCH,
    };

    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
