const parser = require("../../../../../app/services/parsers/giovanni/model1");
const logger = require("../../../../../app/utilities/logger");
const parser_model = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/giovanni/model1");

describe("parseGiovanniModel1", () => {
  test("parses json", () => {
    const packingListJson = model.validModel.RANA;
    const result = parser.parse(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[3].C);
    expect(result.items[1].description).toBe(packingListJson[4].C);
    expect(result.items[0].number_of_packages).toBe(packingListJson[3].G);
    expect(result.items[1].number_of_packages).toBe(packingListJson[4].G);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[3].H);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[4].H);
    expect(result.items[0].commodity_code).toBe(packingListJson[3].E);
    expect(result.items[0].commodity_code).toBe(packingListJson[4].E);
    expect(result.parserModel).toBe(parserModel.GIOVANNI1);
  });

  test("parses empty json", () => {
    const packingListJson = model.emptyModel.RANA;

    const result = parser.parse(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.parserModel).toBe(parserModel.GIOVANNI1);
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
