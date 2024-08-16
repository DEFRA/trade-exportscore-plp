const Parser = require("../../../../../../app/services/parsers/nisa/model3/parser");
const ParserModel = require("../../../../../../app/services/parser-model");

describe("parseNisa3", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "RMS ESTABLISHMENT NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "CO OP BROCCOLI",
        F: "0403209300",
        G: 1,
        I: 2,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[3].E);
    expect(result.items[1].description).toBe(packingListJson[4].E);
    expect(result.items[0].nature_of_products).toBe(packingListJson[3].C);
    expect(result.items[1].nature_of_products).toBe(packingListJson[4].C);
    expect(result.items[0].commodity_code).toBe(packingListJson[3].F);
    expect(result.items[1].commodity_code).toBe(packingListJson[4].F);
    expect(result.items[0].number_of_packages).toBe(packingListJson[3].G);
    expect(result.items[1].number_of_packages).toBe(packingListJson[4].G);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[3].I);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[4].I);
    expect(result.parserModel).toBe(ParserModel.NISA3);
  });

  test("parses empty json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {},
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        I: "NET WEIGHT TOTAL",
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
    expect(result.parserModel).toBe(ParserModel.NISA3);
  });
});
