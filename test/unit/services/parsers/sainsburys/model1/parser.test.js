const Parser = require("../../../../../app/services/sainsburys/parser");

describe("parseSainsburysModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        E: "Product / Part Number Description",
        C: "Product Type / Category",
        O: "Commodity Code",
        G: "Packages",
        H: "Net\nWeight / Package KG",
      },
      {
        E: "JS Chicken Korma 400g",
        C: "Chilled Indian Meals",
        O: "0709991000",
        G: 1,
        H: 3.15,
        N: "RMS-GB-000094-002​",
      },
      {
        E: "JS TTD Gunpowder Potatoes 250g",
        C: "Chilled Indian Meals",
        O: "1602323090",
        G: 2,
        H: 1.4,
        N: "RMS-GB-000094-002​",
      },
    ];

    const result = parserService.parseSainsburys(packingListJson);
    expect(result.registration_approval_number).toBe("RMS-GB-000094-002");
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].E);
    expect(result.items[1].description).toBe(packingListJson[2].E);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].C);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].C);
    expect(result.items[0].commodity_code).toBe(packingListJson[1].O);
    expect(result.items[1].commodity_code).toBe(packingListJson[2].O);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].G);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].G);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].H);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].H);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        E: "Product / Part Number Description",
        C: "Product Type / Category",
        O: "Commodity Code",
        G: "Packages",
        H: "Net\nWeight / Package KG",
      },
      {},
    ];

    const result = parserService.parseSainsburys(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
