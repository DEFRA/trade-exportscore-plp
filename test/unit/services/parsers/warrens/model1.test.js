const parser = require("../../../../../app/services/parsers/warrens/model1");
const logger = require("../../../../../app/utilities/logger");
const parserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/warrens/model1");
const test_results = require("../../../test-data-and-results/results/warrens/model1");

describe("parseWarrensModel1", () => {
  test("parses json", () => {
    const result = parser.parse(model.validModel);

    expect(result).toEqual(test_results.validTestResult);
  });

  test("parses multiple sheets", () => {
    const result = parser.parse(model.validModel_Multiple);

    expect(result).toEqual(test_results.validTestResultMultiple);
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

  test("should call logger.logError when an error is thrown", () => {
    // Spy on the logError method
    const logErrorSpy = jest.spyOn(logger, "logError");
    // Call the parse function with null data
    parser.parse(null);
    // Check if logger.logError has been called
    expect(logErrorSpy).toHaveBeenCalled();
  });

  test("should return the error and an error message", () => {
    const result = parser.parse({});
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("array is not iterable");
  });
});
