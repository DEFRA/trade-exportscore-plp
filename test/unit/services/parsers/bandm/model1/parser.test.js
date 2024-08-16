const Parser = require("../../../../../../app/services/parsers/bandm/model1/parser");
const MatchedModel = require("../../../../../../app/services/matched-model");

describe("parseBandMModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {},
      {},
      {
        H: "WAREHOUSE SCHEME NUMBER:",
        I: "RMS-GB-000005-001",
      },
      {},
      {},
      {
        A: "PRODUCT CODE (SHORT)",
        B: "PRISM",
        C: "ITEM DESCRIPTION",
        D: "COMMODITY CODE",
        E: "PLACE OF DISPATCH",
        F: "TOTAL NUMBER OF CASES",
        G: "NET WEIGHT",
        H: "GROSS WEIGHT",
        I: "ANIMAL ORIGIN",
      },
      {
        A: 412267,
        B: 10145600,
        C: "J/L JERKY 70G TERIYAKI",
        D: 16025095,
        E: "RMS-GB-000005-001",
        F: 1,
        G: 1.15,
        H: 1.28,
        I: "YES",
      },
      {
        A: 351357,
        B: 10300700,
        C: "MINI ROLLS 10PK",
        D: 19053199,
        E: "RMS-GB-000005-001",
        F: 1,
        G: 3.27,
        H: 3.63,
        I: "YES",
      },
      {
        A: " ",
        B: " ",
        C: " ",
        D: " ",
        E: " ",
        F: 1,
        G: 3.27,
        H: 3.63,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBe(packingListJson[2].I);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[6].C);
    expect(result.items[1].description).toBe(packingListJson[7].C);
    expect(result.items[0].commodity_code).toBe(packingListJson[6].D);
    expect(result.items[1].commodity_code).toBe(packingListJson[7].D);
    expect(result.items[0].number_of_packages).toBe(packingListJson[6].F);
    expect(result.items[1].number_of_packages).toBe(packingListJson[7].F);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[6].G);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[7].G);
    expect(result.parserModel).toBe(MatchedModel.BANDM1);
  });

  test("parses null json", () => {
    const packingListJson = [
      {},
      {},
      {
        H: "WAREHOUSE SCHEME NUMBER:",
      },
      {},
      {},
      {
        A: "PRODUCT CODE (SHORT)",
        B: "PRISM",
        C: "ITEM DESCRIPTION",
        D: "COMMODITY CODE",
        E: "PLACE OF DISPATCH",
        F: "TOTAL NUMBER OF CASES",
        G: "NET WEIGHT",
        H: "GROSS WEIGHT",
        I: "ANIMAL ORIGIN",
      },
      {
        A: 412267,
        B: 10145600,
        E: "RMS-GB-000005-001",
        H: 1.28,
        I: "YES",
      },
      {
        A: " ",
        B: " ",
        C: " ",
        D: " ",
        E: " ",
        F: 1,
        G: 3.27,
        H: 3.63,
      },
    ];

    const result = Parser.parse(packingListJson);

    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.parserModel).toBe(MatchedModel.BANDM1);
  });
});
