const parser = require("../../../../../app/services/parsers/warrens/model1");
const logger = require("../../../../../app/utilities/logger");
const parser_model = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/warrens/model1");
const testResults = require("../../../test-data-and-results/results/warrens/model1");

describe("parseWarrensModel1", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(testResults.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModel_Multiple);

    expect(result).toEqual(testResults.validTestResultMultiple);
  });

  test("parses empty json", () => {
    const packingListJson = model.emptyModel;

    const result = parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.parserModel).toBe(parserModel.WARRENS1);
  });

  test("should call logger.log_error when an error is thrown", () => {
    // Spy on the log_error method
    const logErrorSpy = jest.spyOn(logger, "log_error");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.log_error has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });
});
