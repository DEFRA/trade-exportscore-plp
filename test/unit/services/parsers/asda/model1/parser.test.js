const Parser = require("../../../../../../app/services/parsers/asda/model1/parser");
const model = require("../../../../test-helpers/asda/model1/data-model");
describe("parseAsdaModel1", () => {
  test("parses json", () => {
    const packingListJson = model.validModel.PackingList_Extract;
    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].D);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].A);
    expect(result.items[1].description).toBe(packingListJson[2].A);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].B);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].B);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[1].C);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[2].C);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].F);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].F);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].G);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].G);
  });

  test("parses null json", () => {
    const packingListJson = model.emptyModel.PackingList_Extract;

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
module.exports={};
