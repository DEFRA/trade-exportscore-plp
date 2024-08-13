const Parser = require("../../../../../../app/services/parsers/nisa/model3/parser");

describe("parseNisa3", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {},
      {
        C: "PRODUCT_TYPE_CATEGORY",
        E: "PART_NUMBER_DESCRIPTION",
        F: "TARIFF_CODE_EU",
        G: "PACKAGES",
        H: "NET_WEIGHT_TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        H: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "CO OP BROCCOLI",
        F: "0403209300",
        G: 1,
        H: 2,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[4].E);
    expect(result.items[1].description).toBe(packingListJson[5].E);
    expect(result.items[0].nature_of_products).toBe(packingListJson[4].C);
    expect(result.items[1].nature_of_products).toBe(packingListJson[5].C);
    expect(result.items[0].commodity_code).toBe(packingListJson[4].F);
    expect(result.items[1].commodity_code).toBe(packingListJson[5].F);
    expect(result.items[0].number_of_packages).toBe(packingListJson[4].G);
    expect(result.items[1].number_of_packages).toBe(packingListJson[5].G);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[4].H);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[5].H);
  });

  test("parses empty json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {},
      {},
      {
        C: "PRODUCT_TYPE_CATEGORY",
        E: "PART_NUMBER_DESCRIPTION",
        F: "TARIFF_CODE_EU",
        G: "PACKAGES",
        H: "NET_WEIGHT_TOTAL",
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
