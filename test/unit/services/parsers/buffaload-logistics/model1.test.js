const Parser = require("../../../../../app/services/parsers/buffaload-logistics/model1");
const ParserModel = require("../../../../../app/services/parser-model");

describe("parsesBuffaloadLogisticsModel1", () => {
  test("parses valid json", () => {
    const packingListJson = [
      {
        A: "NIIRMS Dispatch number",
        B: "RMS-GB-000098-001",
        C: "Dispatch address",
        D: "Buffaload Logistics, Gateway Industrial Estate, Crewe, Cheshire, CW1 6YY",
      },
      {
        A: "Commodity code",
        B: "Description of goods",
        C: "Country of Origin",
        D: "No. of pkgs",
        E: "Type of pkgs",
        F: "Item Gross Weight (kgs)",
        G: "Item Net Weight (kgs)",
        H: "Treatment Type (Chilled /Ambient)",
        I: "NIRMS Lane (R/G)",
      },
      {
        A: "1905908000",
        B: "60008347 - Take-Out Club Classic Crust Kickin' Meat Feast",
        C: "Great Britain",
        D: 6,
        E: "Cases",
        F: 3.782,
        G: 3.552,
        H: "Chilled",
        I: "Green",
      },
      {
        A: "1905908000",
        B: "60008348 - Take-Out Club Classic Crust Smokin' BBQ Pulled Pork",
        C: "Great Britain",
        D: 5,
        E: "Cases",
        F: 3.788,
        G: 3.558,
        H: "Chilled",
        I: "Green",
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[0].B);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[2].B);
    expect(result.items[1].description).toBe(packingListJson[3].B);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[2].H);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[3].H);
    expect(result.items[0].commodity_code).toBe(packingListJson[2].A);
    expect(result.items[1].commodity_code).toBe(packingListJson[3].A);
    expect(result.items[0].number_of_packages).toBe(packingListJson[2].D);
    expect(result.items[1].number_of_packages).toBe(packingListJson[3].D);
    expect(result.parserModel).toBe(ParserModel.BUFFALOAD1);
  });

  test("parses empty json", () => {
    const packingListJson = [
      {
        A: "NIIRMS Dispatch number",
        B: null,
        C: "Dispatch address",
        D: "Buffaload Logistics, Gateway Industrial Estate, Crewe, Cheshire, CW1 6YY",
      },
      {
        A: "Commodity code",
        B: "Description of goods",
        C: "Country of Origin",
        D: "No. of pkgs",
        E: "Type of pkgs",
        F: "Item Gross Weight (kgs)",
        G: "Item Net Weight (kgs)",
        H: "Treatment Type (Chilled /Ambient)",
        I: "NIRMS Lane (R/G)",
      },
      {},
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.parserModel).toBe(ParserModel.BUFFALOAD1);
  });
});
