const Parser = require("../../../../../../app/services/parsers/tescos/model2/parser");

describe("parseTescoModel2", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "Item",
        B: "Product code",
        C: "Commmodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs",
        I: "Type of pkgs",
        J: "Total Gross Weight",
        K: "Total Net Weight",
        L: "Total Line Value",
        M: "GB Establishment RMS Number",
      },
      {},
      {
        A: "1",
        B: "SKU1944",
        C: "2005995090",
        F: "TF R/Bow Tom with Blsac Glze 340g x4",
        G: "Great Britain",
        H: "4",
        I: "Cases",
        J: "16",
        K: "9.312",
        L: "31.04",
        M: "RMS-GB-000015-009",
      },
      {
        A: "2",
        B: "SKU1938",
        C: "2005995090",
        F: "TF 300g Roasting Vegetables x8",
        G: "Great Britain",
        H: "4",
        I: "Cases",
        J: "32",
        K: "16.144",
        L: "64.32",
        M: "RMS-GB-000015-009",
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[2].M);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[2].F);
    expect(result.items[1].description).toBe(packingListJson[3].F);
    expect(result.items[0].commodity_code).toBe(packingListJson[2].C);
    expect(result.items[1].commodity_code).toBe(packingListJson[3].C);
    expect(result.items[0].number_of_packages).toBe(packingListJson[2].H);
    expect(result.items[1].number_of_packages).toBe(packingListJson[3].H);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[2].K);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[3].K);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        A: "Item",
        B: "Product code",
        C: "Commmodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs",
        I: "Type of pkgs",
        J: "Total Gross Weight",
        K: "Total Net Weight",
        L: "Total Line Value",
        M: "GB Establishment RMS Number",
      },
      {},
      {
        A: "1",
        B: "SKU1944",
        G: "Great Britain",
        I: "Cases",
        J: "16",
        L: "31.04",
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
