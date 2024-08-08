const Parser = require("../../../../../../app/services/parsers/tescos/model1/parser");

describe("parseTescoModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        G: "CONTIGO AUTO-POP BOTTLE 720ML",
        L: "9617000000",
        AS: "Ambient",
        AT: "Y",
        BR: "1",
        BT: "1.49",
        BU: "1.4155",
      },
      {
        G: "JOIE MEASURING SPOONS",
        L: "3924100090",
        AS: "Ambient",
        AT: "Y",
        BR: "1",
        BT: "0.84",
        BU: "0.798",
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[3].AT);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[5].G);
    expect(result.items[1].description).toBe(packingListJson[6].G);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[5].AS);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[6].AS);
    expect(result.items[0].commodity_code).toBe(packingListJson[5].L);
    expect(result.items[1].commodity_code).toBe(packingListJson[6].L);
    expect(result.items[0].number_of_packages).toBe(packingListJson[5].BR);
    expect(result.items[1].number_of_packages).toBe(packingListJson[6].BR);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[5].BU);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[6].BU);
  });

  test("parses null json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {},
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        AT: "Y",
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
