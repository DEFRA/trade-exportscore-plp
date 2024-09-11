const Parser = require("../../../../../app/services/parsers/warrens/model1");
const ParserModel = require("../../../../../app/services/parser-model");
const model = require("../../../test-data-and-results/models/warrens/model1/model1");

describe("parseWarrensModel1", () => {
  test("parses json", () => {
    const expectedResult = model.validTestResult;
    const result = Parser.parse(model.validModel);
    expect(result.registration_approval_number).toBe(
      expectedResult.registration_approval_number,
    );
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(
      expectedResult.items[0].description,
    );
    expect(result.items[1].description).toBe(
      expectedResult.items[1].description,
    );
    expect(result.items[0].commodity_code).toBe(
      expectedResult.items[0].commodity_code,
    );
    expect(result.items[1].commodity_code).toBe(
      expectedResult.items[1].commodity_code,
    );
    expect(result.items[0].number_of_packages).toBe(
      expectedResult.items[0].number_of_packages,
    );
    expect(result.items[1].number_of_packages).toBe(
      expectedResult.items[1].number_of_packages,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      expectedResult.items[0].total_net_weight_kg,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      expectedResult.items[1].total_net_weight_kg,
    );
    expect(result.items[0].type_of_treatment).toBe(
      expectedResult.items[0].type_of_treatment,
    );
    expect(result.items[1].type_of_treatment).toBe(
      expectedResult.items[1].type_of_treatment,
    );
    expect(result.parserModel).toBe(ParserModel.WARRENS1);
  });

  test("parses multiple sheets", () => {
    const expectedResult = model.validTestResultMultiple;
    const result = Parser.parse(model.validModel_Multiple);

    expect(result.registration_approval_number).toBe(
      expectedResult.registration_approval_number,
    );
    expect(result.items).toHaveLength(4);
    expect(result.items[0].description).toBe(
      expectedResult.items[0].description,
    );
    expect(result.items[1].description).toBe(
      expectedResult.items[1].description,
    );
    expect(result.items[0].commodity_code).toBe(
      expectedResult.items[0].commodity_code,
    );
    expect(result.items[1].commodity_code).toBe(
      expectedResult.items[1].commodity_code,
    );
    expect(result.items[0].number_of_packages).toBe(
      expectedResult.items[0].number_of_packages,
    );
    expect(result.items[1].number_of_packages).toBe(
      expectedResult.items[1].number_of_packages,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      expectedResult.items[0].total_net_weight_kg,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      expectedResult.items[1].total_net_weight_kg,
    );
    expect(result.items[0].type_of_treatment).toBe(
      expectedResult.items[0].type_of_treatment,
    );
    expect(result.items[1].type_of_treatment).toBe(
      expectedResult.items[1].type_of_treatment,
    );
    expect(result.items[2].description).toBe(
      expectedResult.items[2].description,
    );
    expect(result.items[3].description).toBe(
      expectedResult.items[3].description,
    );
    expect(result.items[2].commodity_code).toBe(
      expectedResult.items[2].commodity_code,
    );
    expect(result.items[3].commodity_code).toBe(
      expectedResult.items[3].commodity_code,
    );
    expect(result.items[2].number_of_packages).toBe(
      expectedResult.items[2].number_of_packages,
    );
    expect(result.items[3].number_of_packages).toBe(
      expectedResult.items[3].number_of_packages,
    );
    expect(result.items[2].total_net_weight_kg).toBe(
      expectedResult.items[2].total_net_weight_kg,
    );
    expect(result.items[3].total_net_weight_kg).toBe(
      expectedResult.items[3].total_net_weight_kg,
    );
    expect(result.items[2].type_of_treatment).toBe(
      expectedResult.items[2].type_of_treatment,
    );
    expect(result.items[3].type_of_treatment).toBe(
      expectedResult.items[3].type_of_treatment,
    );
    expect(result.parserModel).toBe(ParserModel.WARRENS1);
  });

  test("parses null json", () => {
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
