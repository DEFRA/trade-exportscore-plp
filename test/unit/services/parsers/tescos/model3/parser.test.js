const Parser = require("../../../../../../app/services/parsers/tescos/model3/parser");
const ParserModel = require("../../../../../../app/services/parser-model");

describe("parseTescoModel3", () => {
  test("parses valid json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {
        E: "RMS-GB-000022-999",
      },
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        A: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        B: "4015900000",
        C: "AMBIENT",
        D: "Y",
        E: 1,
        F: 0.46,
        G: 0.437,
      },
      {
        A: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        B: "0401401090",
        C: "AMBIENT",
        D: "Y",
        E: 2,
        F: 5.68,
        G: 5.396,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[3].E);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[5].A);
    expect(result.items[1].description).toBe(packingListJson[6].A);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[5].C);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[6].C);
    expect(result.items[0].commodity_code).toBe(packingListJson[5].B);
    expect(result.items[1].commodity_code).toBe(packingListJson[6].B);
    expect(result.items[0].number_of_packages).toBe(packingListJson[5].E);
    expect(result.items[1].number_of_packages).toBe(packingListJson[6].E);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[5].G);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[6].G);
    expect(result.parserModel).toBe(ParserModel.TESCO3);
  });

  test("parses empty json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {},
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        E: null,
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
    expect(result.parserModel).toBe(ParserModel.TESCO3);
  });
});
