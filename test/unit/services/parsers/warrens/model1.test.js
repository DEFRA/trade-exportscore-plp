const Parser = require("../../../../../app/services/parsers/warrens/model1");
const ParserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/warrens/model1");
const testResults = require("../../../test-data-and-results/results/warrens/model1");

describe("parseWarrensModel1", () => {
  test("parses valid Model 1 and returns all_required_fields_present as true", () => {
    const result = Parser.parse(model.validModel);

    expect(result).toEqual(testResults.validModel);
  });

  test("parses multiple sheets", () => {
    const result = Parser.parse(model.validModel_Multiple);

    expect(result).toEqual(testResults.validModel_Multiple);
  });

  test("parses empty json", () => {
    const packingListJson = model.emptyModel;

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.parserModel).toBe(ParserModel.WARRENS1);
  });
});
