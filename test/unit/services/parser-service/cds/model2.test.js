const parserService = require("../../../../../app/services/parser-service");
const model = require("../../../test-data-and-results/models/cds/model2");
const parserModel = require("../../../../../app/services/parser-model");
const test_results = require("../../../test-data-and-results/results/cds/model2");

jest.mock("../../../../../app/services/data/data-iso-codes.json", () => [
  "GB",
  "VALID_ISO",
  "PROHIBITED_ITEM_ISO",
]);
jest.mock("../../../../../app/services/data/data-prohibited-items.json", () => [
  {
    country_of_origin: "PROHIBITED_ITEM_ISO",
    commodity_code: "012",
    type_of_treatment: "PROHIBITED_ITEM_TREATMENT",
  },
]);

const filename = "packinglist-cds-model2.xlsx";

describe("matchesCdsModel2", () => {
  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(model.validModel, filename);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("matches valid CDS Model 2 file, calls parser, but returns all_required_fields_present as false when cells missing", async () => {
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

  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as false for multiple rms", async () => {
    const result = await parserService.findParser(model.multipleRms, filename);

    expect(result).toMatchObject(test_results.multipleRms);
  });

  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as false for multiple sheets", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheets,
      filename,
    );

    expect(result).toMatchObject(test_results.validTestResultForMultipleSheets);
  });

  test("matches valid CDS Model 2 file, calls parser and returns all_required_fields_present as false for missing kg unit", async () => {
    const result = await parserService.findParser(
      model.missingKgunit,
      filename,
    );

    expect(result).toMatchObject(test_results.missingKgunit);
  });

  test("matches empty CDS Model 2 file and handles empty results appropriately", async () => {
    const result = await parserService.findParser(model.emptyModel, filename);

    expect(result).toMatchObject(test_results.emptyTestResultNoRemos);
  });

  test("matches valid CDS Model 2 file with multiple sheets where headers are on different rows, calls parser and returns all_required_fields_present as true", async () => {
    const result = await parserService.findParser(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
      filename,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(2);
    expect(result.items[1].row_location.rowNumber).toBe(3);
  });
});

describe("matchesCdsModel2_CoOValidation", () => {
  test("handles Non-NIRMS items with null country of origin correctly", async () => {
    const result = await parserService.findParser(
      model.validNonNirmsWithNullCountryOfOrigin,
      filename,
    );

    expect(result).toMatchObject(
      test_results.validTestResultWithNonNirmsNullCountryOfOrigin,
    );
  });

  test("fails validation when NIRMS item has missing country of origin", async () => {
    const result = await parserService.findParser(
      model.invalidNirmsMissingCountryOfOrigin,
      filename,
    );

    expect(result).toMatchObject(
      test_results.invalidTestResultNirmsMissingCountryOfOrigin,
    );
  });

  test("matches valid CDS Model 2 file with Non-NIRMS multiple formats", async () => {
    const result = await parserService.findParser(
      model.validModel_CoO__NonNirmsMultipleFormats,
      filename,
    );
    expect(result).toMatchObject(
      test_results.validTestResultNonNirmsMultipleFormats,
    );
  });

  test("matches valid CDS Model 2 file with NIRMS multiple formats", async () => {
    const result = await parserService.findParser(
      model.validModel_CoO__NirmsMultipleFormats,
      filename,
    );
    expect(result).toMatchObject(
      test_results.validTestResultNirmsMultipleFormats,
    );
  });

  test("matches CDS Model 2 file with invalid NIRMS values (more than 3 issues) and returns validation errors", async () => {
    const result = await parserService.findParser(
      model.CoO_InvalidNirms_MoreThan3,
      filename,
    );
    expect(result).toMatchObject(
      test_results.invalidTestResultInvalidNirmsMoreThan3,
    );
  });

  test("matches CDS Model 2 file with invalid NIRMS values (less than 3 issues) and returns validation errors", async () => {
    const result = await parserService.findParser(
      model.CoO_InvalidNirms_LessThan3,
      filename,
    );
    expect(result).toMatchObject(
      test_results.invalidTestResultInvalidNirmsLessThan3,
    );
  });

  test("matches valid CDS Model 2 file with items not on prohibited list", async () => {
    const result = await parserService.findParser(
      model.validModel_CoO__NotOnProhibitedItemsList,
      filename,
    );
    expect(result).toMatchObject(
      test_results.validTestResultNotOnProhibitedItemsList,
    );
  });

  test("matches CDS Model 2 file with items on prohibited list and returns validation errors", async () => {
    const result = await parserService.findParser(
      model.validModel_CoO__OnProhibitedItemsList,
      filename,
    );
    expect(result).toMatchObject(
      test_results.validTestResultOnProhibitedItemsList,
    );
  });

  test("matches CDS Model 2 file with multiple prohibited items (more than 3) with no treatment type and returns validation errors", async () => {
    const result = await parserService.findParser(
      model.validModel_CoO__MultipleProhibitedItemsList_NoTreatmentType,
      filename,
    );
    expect(result).toMatchObject(
      test_results.validTestResultMultipleProhibitedItemsList_NoTreatmentType,
    );
  });

  test("matches CDS Model 2 file with multiple prohibited items (more than 3) with treatment type and returns validation errors", async () => {
    const result = await parserService.findParser(
      model.validModel_CoO__MultipleProhibitedItemsListMoreThan3_TreatmentType,
      filename,
    );
    expect(result).toMatchObject(
      test_results.validTestResultMultipleProhibitedItemsListMoreThan3_TreatmentType,
    );
  });
});
