const Parser = require("../../../../../../app/services/parsers/nisa/model1/parser");

describe("parseNisa", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: 2,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "CO OP BROCCOLI",
        L: "0403209300",
        M: 1,
        O: 2,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].K);
    expect(result.items[1].description).toBe(packingListJson[2].K);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].I);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].I);
    expect(result.items[0].commodity_code).toBe(packingListJson[1].L);
    expect(result.items[1].commodity_code).toBe(packingListJson[2].L);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].M);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].M);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].O);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].O);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
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
  });
});
