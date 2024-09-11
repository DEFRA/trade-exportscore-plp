const ParserModel = require("../../../../../app/services/parser-model");
const Parser = require("../../../../../app/services/parsers/davenport/model1");
const model = require("../../../test-helpers/davenport/model1/data-model");

describe("parseDavenportModel1", () => {
  test("parses json", () => {
    const packingListJson = model.validModel.Customer_Order;

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[18].C);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[45].F);
    expect(result.items[1].description).toBe(packingListJson[46].F);
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[1].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[1].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBe(packingListJson[45].H);
    expect(result.items[1].number_of_packages).toBe(packingListJson[46].H);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[45].K);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[46].K);
    expect(result.parserModel).toBe(ParserModel.DAVENPORT1);
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
    expect(result.parserModel).toBe(ParserModel.DAVENPORT1);
  });
});
