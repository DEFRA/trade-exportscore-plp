const ParserModel = require("../../../../../../app/services/parser-model");
const Parser = require("../../../../../../app/services/parsers/kepak/model1/parser");
const model = require("../../../../test-helpers/kepak/model1/data-model");
describe("parseKepakModel1", () => {
  test("parses json", () => {
    const packingListJson = model.validModel.KEPAK;
    const result = Parser.parse(packingListJson);
    const establishmentNumberRow = 12;
    const dataRow = 21;

    expect(result.registration_approval_number).toBe(
      packingListJson[establishmentNumberRow].A,
    );
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[dataRow].C);
    expect(result.items[1].description).toBe(packingListJson[dataRow + 1].C);
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[1].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[1].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBe(packingListJson[dataRow].G);
    expect(result.items[1].number_of_packages).toBe(
      packingListJson[dataRow + 1].G,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      packingListJson[dataRow].H,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      packingListJson[dataRow + 1].H,
    );
    expect(result.parserModel).toBe(ParserModel.KEPAK1);
  });

  test("parses null json", () => {
    const packingListJson = model.emptyModel.KEPAK;

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.parserModel).toBe(ParserModel.KEPAK1);
  });
});
module.exports = {};
