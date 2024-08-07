const nisaParser2 = require("../../../../../app/services/nisa/parser2");

describe("parseNisa2", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        B: "RMS_ESTABLISHMENT_NO",
        J: "PRODUCT_TYPE_CATEGORY",
        L: "PART_NUMBER_DESCRIPTION",
        M: "TARIFF_CODE_EU",
        N: "PACKAGES",
        P: "NET_WEIGHT_TOTAL",
      },
      {
        B: "RMS-GB-000025-001",
        J: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        L: "DAIRYLEA DUNKERS JUMBO PM80P",
        M: "2005995090",
        N: 2,
        P: 2.5,
      },
      {
        B: "RMS-GB-000025-001",
        J: "900 - VEGETABLES PREPACK-C",
        L: "CO OP BROCCOLI",
        M: "0403209300",
        N: 1,
        P: 2,
      },
    ];

    const result = nisaParser2.parse(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[1].B);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].L);
    expect(result.items[1].description).toBe(packingListJson[2].L);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].J);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].J);
    expect(result.items[0].commodity_code).toBe(packingListJson[1].M);
    expect(result.items[1].commodity_code).toBe(packingListJson[2].M);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].N);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].N);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].P);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].P);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        B: "RMS_ESTABLISHMENT_NO",
        J: "PRODUCT_TYPE_CATEGORY",
        L: "PART_NUMBER_DESCRIPTION",
        M: "TARIFF_CODE_EU",
        N: "PACKAGES",
        P: "NET_WEIGHT_TOTAL",
      },
      {},
    ];

    const result = nisaParser2.parse(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
