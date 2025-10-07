const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/asda/model4");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/asda/model4");

const filename = "packinglist.csv";

describe("matchesAsdaModel4", () => {
  test("matches valid ASDA Model 4 CSV file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid ASDA Model 4 CSV file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MissingColumnCells,
      filename,
    );

    expect(result).toMatchObject(test_results.invalidTestResult_MissingCells);
  });

  test("returns 'No Match' for incorrect file extension", async () => {
    const filename = "packinglist.wrong";
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: null,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };

    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });

  test("matches valid ASDA Model 4 CSV file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(
      model.invalidModel_MultipleRms,
      filename,
    );

    expect(result).toMatchObject(test_results.invalidTestResult_MultipleRms);
  });

  test("returns 'No Match' for empty model", async () => {
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
        failure_reasons: expect.stringContaining(
          "Check GB Establishment RMS Number",
        ),
      },
      items: [],
      registration_approval_number: null,
      parserModel: "no-remos",
    };

    const result = await parserService.findParser(model.emptyModel, filename);

    expect(result).toMatchObject(invalidTestResult_NoMatch);
  });
});
