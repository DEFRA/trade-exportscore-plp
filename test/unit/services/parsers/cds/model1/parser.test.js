const Parser = require("../../../../../../app/services/parsers/cds/model1/parser");
const ParserModel = require("../../../../../../app/services/parser-model");

describe("parseCdsModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "TruckID",
        B: "Dept",
        C: "SubDept",
        D: "Product",
        E: "# Packages",
        F: "# Units",
        G: "GrossWeight",
        H: "NetWeight",
        I: "NatureOfProduct",
        J: "Treatment",
        K: "PlaceOfDispatch",
      },
      {
        A: "51270",
        B: "0001 - Gardens",
        C: "0101 - Garden Care",
        D: "002541 - Tapered Slate Small Planter Ash",
        E: "2",
        F: "2",
        G: "2",
        H: "1.9",
        I: "General Retail Goods",
        J: "Ambient Goods",
        K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
      },
      {
        A: "51250",
        B: "0003 - Home Decor",
        C: "0322 - Home Fragrance",
        D: "070398 - Amber Wood / Velvet Rose Oud Candle",
        E: "4",
        F: "24",
        G: "26",
        H: "24.7",
        I: "General Retail Goods",
        J: "Ambient Goods",
        K: "THE RANGE / RMS-GB-000252-002 / DN8 4HT",
      },
    ];

    const result = Parser.parse(packingListJson);
    const placeOfDispatchSplit = packingListJson[1].K?.split("/") ?? [];
    const expectedEstablishmentNumber =
      placeOfDispatchSplit.length > 1 ? placeOfDispatchSplit[1].trim() : null;
    expect(result.registration_approval_number).toBe(
      expectedEstablishmentNumber,
    );
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].D);
    expect(result.items[1].description).toBe(packingListJson[2].D);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].I);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].I);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[1].J);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[2].J);
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[1].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].E);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].E);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].H);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].H);
    expect(result.parserModel).toBe(ParserModel.CDS1);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        A: "TruckID",
        B: "Dept",
        C: "SubDept",
        D: "Product",
        E: "# Packages",
        F: "# Units",
        G: "GrossWeight",
        H: "NetWeight",
        I: "NatureOfProduct",
        J: "Treatment",
        K: "PlaceOfDispatch",
      },
      {
        K: null,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.parserModel).toBe(ParserModel.CDS1);
  });
});
