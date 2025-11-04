const parser = require("../../../../../app/services/parsers/fowlerwelch/model2");
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/fowlerwelch/model2");
const test_results = require("../../../test-data-and-results/results/fowlerwelch/model2");

describe("parseFowlerwelchModel2", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toMatchObject(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModel_Multiple);

    expect(result).toMatchObject(test_results.validTestResultMultiple);
  });

  test("parses empty json", () => {
    const packingListJson = model.emptyModel;

    const result = parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(0);
    expect(result.parserModel).toBe(parserModel.FOWLERWELCH2);
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
