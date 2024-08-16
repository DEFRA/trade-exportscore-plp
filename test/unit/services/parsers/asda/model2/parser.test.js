const Parser = require("../../../../../../app/services/parsers/asda/model2/parser");
const MatchedModel = require("../../../../../../app/services/matched-model");

describe("parseAsdaModel2", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        B: "4PK X 17 PINK LADY APPLES",
        D: "TOP FRUIT",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 20,
        L: 12.75,
        N: 255,
      },
      {
        B: "ASDA BABY WATERMELON X10",
        D: "MELON HARD",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 5,
        L: 12,
        N: 60,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].H);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].B);
    expect(result.items[1].description).toBe(packingListJson[2].B);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].D);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].D);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[1].F);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[2].F);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].J);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].J);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].N);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].N);
    expect(result.parserModel).toBe(MatchedModel.ASDA2);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {},
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.parserModel).toBe(MatchedModel.ASDA2);
  });
});
