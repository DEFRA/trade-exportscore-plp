const parser = require("../../../../../app/services/parsers/bandm/model1");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/bandm/model1");
const jsonFile = require("../../../../../app/utilities/json-file");
const test_results = require("../../../test-data-and-results/results/bandm/model1");

describe("parseBandMModel1", () => {
  test("parses populated json", () => {
    const packingListJson = JSON.stringify(model.validModel);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("parses populated json with case insensitive headers", () => {
    const packingListJson = JSON.stringify(model.validModelInsensitiveHeader);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const packingListJson = JSON.stringify(model.validModelMultipleSheets);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toMatchObject(test_results.validTestResultForMultipleSheets);
  });

  test("parses multiple sheets with headers on different rows", () => {
    const result = parser.parse(
      model.validModelMultipleSheetsHeadersOnDifferentRows,
    );

    expect(result.business_checks.all_required_fields_present).toBe(true);
    expect(result.items[0].row_location.rowNumber).toBe(4);
    expect(result.items[1].row_location.rowNumber).toBe(5);
  });

  test("parses empty json", () => {
    const packingListJson = JSON.stringify(model.emptyModel);
    const sanitisedPackingListJson = jsonFile.sanitise(packingListJson);
    const sanitisedPackingList = JSON.parse(sanitisedPackingListJson);

    const result = parser.parse(sanitisedPackingList);

    expect(result).toMatchObject(test_results.emptyTestResult);
  });

  test("should call logger.logError when an error is thrown", () => {
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
