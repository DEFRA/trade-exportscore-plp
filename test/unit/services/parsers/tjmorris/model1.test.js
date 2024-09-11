const Parser = require("../../../../../app/services/parsers/tjmorris/model1");
const ParserModel = require("../../../../../app/services/parser-model");

describe("parseTjmorrisModel1", () => {
  test("parses valid json", () => {
    const packingListJson = [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "SANDWICHES",
        N: "28 TUNA CRUNCH TIGER ROLL",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {
        A: "RMS-GB-000010-001",
        J: "CHILLED",
        L: "Description",
        N: "Description",
        O: "0408192000",
        P: "2",
        R: "1.4",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        L: "LETTUCE & BAGGED SALADS",
        N: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: "8",
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].N);
    expect(result.items[1].description).toBe(packingListJson[2].N);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].L);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].L);
    expect(result.items[0].commodity_code).toBe(packingListJson[1].O);
    expect(result.items[1].commodity_code).toBe(packingListJson[2].O);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].P);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].P);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].R);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].R);
    expect(result.parserModel).toBe(ParserModel.TJMORRIS1);
  });

  test("parses empty json", () => {
    const packingListJson = [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "Description",
        N: "Description",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {},
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.parserModel).toBe(ParserModel.TJMORRIS1);
  });
});
