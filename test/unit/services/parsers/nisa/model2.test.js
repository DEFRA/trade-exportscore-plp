const parser = require("../../../../../app/services/parsers/nisa/model2");
const logger = require("../../../../../app/utilities/logger");
const model = require("../../../test-data-and-results/models/nisa/model2");
const test_results = require("../../../test-data-and-results/results/nisa/model2");
const parserModel = require("../../../../../app/services/parser-model");
describe("parseNisa2", () => {
  test("parses populated json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModelMultipleSheets);

    expect(result).toEqual(test_results.validTestResultForMultipleSheets);
  });

  test("parses empty json", () => {
    const result = parser.parse(model.emptyModel);

    expect(result).toEqual(test_results.emptyTestResult);
  });

  test("should call logger.logError when an error is thrown", () => {
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
  test("should return 'No Match' for failed parser", () => {
    const result = parser.parse({ Sheet1: [] });
    const invalidTestResult_NoMatch = {
      business_checks: {
        all_required_fields_present: false,
      },
      items: [],
      registration_approval_number: null,
      parserModel: parserModel.NOMATCH,
    };
    expect(result).toEqual(invalidTestResult_NoMatch);
  });
});
