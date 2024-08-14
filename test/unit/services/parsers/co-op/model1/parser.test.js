const Parser = require("../../../../../../app/services/parsers/co-op/model1/parser");

describe("parseCoopModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: 12,
        S: 12,
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Ripe And Ready To Eat Avocados 2S.",
        P: "0709601001",
        Q: 1,
        S: 1,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[1].E);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].O);
    expect(result.items[1].description).toBe(packingListJson[2].O);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].P);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].P);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].Q);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].Q);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].S);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].S);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        D: null,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
