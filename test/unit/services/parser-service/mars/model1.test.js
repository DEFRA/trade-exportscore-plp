const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/mars/model1");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/mars/model1");

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "VALID_ISO",
  "INELIGIBLE_ITEM_ISO",
  "GB",
  "CN",
  "IT",
  "DE",
  "FR",
  "ES",
  "US",
]);
jest.mock("../../../../../app/services/data/data-ineligible-items.json", () => [
  {
    country_of_origin: "INELIGIBLE_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "INELIGIBLE_ITEM_TREATMENT",
  },
]);

const filename = "packinglist-mars-model1.xlsx";

describe("parsesMarsModel1", () => {
  test("matches valid Mars Model 1 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid Mars Model 1 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid Mars Model 1 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid Mars Model 1 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );
    console.log(result);
    expect(result).toMatchObject(test_results.missingKgunit);
  });

  test("matches valid Mars Model 1 file with multiple sheets where headers are on different rows, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(3);
    expect(result.items[1].row_location.rowNumber).toBe(4);
  });
});

describe("CoO Validation Tests", () => {
  test.each([
    {
      description: "valid Nirms",
      model: model.missingNirms,
      expected: "NIRMS/Non-NIRMS goods not specified",
    },
    {
      description: "invalid Nirms",
      model: model.invalidNirms,
      expected: "Invalid entry for NIRMS/Non-NIRMS",
    },
    {
      description: "missing CoO",
      model: model.missingCoO,
      expected: "Missing Country of Origin",
    },
    {
      description: "invalid CoO",
      model: model.invalidCoO,
      expected: "Invalid Country of Origin ISO Code",
    },
    {
      description: "ineligible item",
      model: model.ineligibleItem,
      expected: "Prohibited item identified on the packing list",
    },
  ])("checks CoO validation for $description", async ({ model, expected }) => {
    const result = await parserService.findParser(model, filename);
    expect(result.business_checks.all_required_fields_present).toBeFalsy();
    expect(result.business_checks.failure_reasons).toContain(expected);
  });
});
