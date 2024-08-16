const fowlerWelchParser2 = require("../../../../app/services/fowlerwelch/parser2");
const {
  isNullOrEmptyOrSpace,
} = require("../../../../app/services/fowlerwelch/parser2");

describe("parseFowlerWelch2", () => {
  test("parses json", () => {
    const packingListJson = {
      "Cust Ord": [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          A: "Item",
          B: "Product code",
          C: "Commodity code",
          D: "Online Check",
          E: "Meursing code",
          F: "Description of goods",
          G: "Country of Origin",
          H: "No. of pkgs",
          I: "Type of pkgs",
          J: "Total Gross Weight",
          K: "Total Net Weight",
          L: "Total Line Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
        },
        {
          A: "1",
          B: "6535096",
          C: "2005800099",
          D: "",
          E: "",
          F: "Sweetcorn Express 8x2",
          G: "",
          H: "5",
          I: "Cases",
          J: "25.119",
          K: "20.000",
          L: "55.40",
          M: "RMS-GB-000216-002",
          N: "Chilled",
          O: "G",
        },
        {
          A: "2",
          B: "4488002",
          C: "2005800099",
          D: "Check - 2005800099",
          E: "",
          F: "Sweetcorn Cobettes 24x4",
          G: "",
          H: "65",
          I: "Cases",
          J: "882.057",
          K: "780.000",
          L: "2195.05",
          M: "RMS-GB-000216-002",
          N: "Chilled",
          O: "G",
        },
      ],
    };
    const result = fowlerWelchParser2.parse(packingListJson);
    expect(result.registration_approval_number).toBe(
      packingListJson["Cust Ord"][45].M,
    );
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson["Cust Ord"][45].F);
    expect(result.items[1].description).toBe(packingListJson["Cust Ord"][46].F);
    expect(result.items[0].commodity_code).toBe(
      packingListJson["Cust Ord"][45].C,
    );
    expect(result.items[1].commodity_code).toBe(
      packingListJson["Cust Ord"][46].C,
    );
    expect(result.items[0].number_of_packages).toBe(
      packingListJson["Cust Ord"][45].H,
    );
    expect(result.items[1].number_of_packages).toBe(
      packingListJson["Cust Ord"][46].H,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      packingListJson["Cust Ord"][45].K,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      packingListJson["Cust Ord"][46].K,
    );
  });

  test("parses multiple sheets", () => {
    const packingListJson = {
      "Cust Ord": [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          A: "Item",
          B: "Product code",
          C: "Commodity code",
          D: "Online Check",
          E: "Meursing code",
          F: "Description of goods",
          G: "Country of Origin",
          H: "No. of pkgs",
          I: "Type of pkgs",
          J: "Total Gross Weight",
          K: "Total Net Weight",
          L: "Total Line Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
        },
        {
          A: "1",
          B: "6535096",
          C: "2005800099",
          D: "",
          E: "",
          F: "Sweetcorn Express 8x2",
          G: "",
          H: "5",
          I: "Cases",
          J: "25.119",
          K: "20.000",
          L: "55.40",
          M: "RMS-GB-000216-002",
          N: "Chilled",
          O: "G",
        },
        {
          A: "2",
          B: "4488002",
          C: "2005800099",
          D: "Check - 2005800099",
          E: "",
          F: "Sweetcorn Cobettes 24x4",
          G: "",
          H: "65",
          I: "Cases",
          J: "882.057",
          K: "780.000",
          L: "2195.05",
          M: "RMS-GB-000216-002",
          N: "Chilled",
          O: "G",
        },
      ],
      ARGO: [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          A: "Item",
          B: "Product code",
          C: "Commodity code",
          D: "Online Check",
          E: "Meursing code",
          F: "Description of goods",
          G: "Country of Origin",
          H: "No. of pkgs",
          I: "Type of pkgs",
          J: "Total Gross Weight",
          K: "Total Net Weight",
          L: "Total Line Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
        },
        {
          A: "1",
          B: "1602329090",
          C: "1602329090",
          D: "Check - 1602329090",
          E: "7010",
          F: "CHICKEN SLICE/PASTY",
          G: "UK",
          H: "5",
          I: "Cases",
          J: "5.5",
          K: "5.1",
          L: "42",
          M: "RMS-GB-000216-001",
          N: "Chilled",
          O: "Green",
        },
        {
          A: "2",
          B: "1602421000",
          C: "1602421000",
          D: "Check - 1602421000",
          E: "7010",
          F: "PEPPERONI SLICE/PASTY",
          G: "UK",
          H: "8",
          I: "Cases",
          J: "8.8",
          K: "8.16",
          L: "67.2",
          M: "RMS-GB-000216-001",
          N: "Chilled",
          O: "Green",
        },
      ],
    };
    const result = fowlerWelchParser2.parse(packingListJson);
    expect(result.registration_approval_number).toBe(
      packingListJson["Cust Ord"][45].M,
    );
    expect(result.items).toHaveLength(4);
    expect(result.items[0].description).toBe(packingListJson["Cust Ord"][45].F);
    expect(result.items[1].description).toBe(packingListJson["Cust Ord"][46].F);
    expect(result.items[0].commodity_code).toBe(
      packingListJson["Cust Ord"][45].C,
    );
    expect(result.items[1].commodity_code).toBe(
      packingListJson["Cust Ord"][46].C,
    );
    expect(result.items[0].number_of_packages).toBe(
      packingListJson["Cust Ord"][45].H,
    );
    expect(result.items[1].number_of_packages).toBe(
      packingListJson["Cust Ord"][46].H,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      packingListJson["Cust Ord"][45].K,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      packingListJson["Cust Ord"][46].K,
    );

    expect(result.items[2].description).toBe(packingListJson["ARGO"][45].F);
    expect(result.items[3].description).toBe(packingListJson["ARGO"][46].F);
    expect(result.items[2].commodity_code).toBe(packingListJson["ARGO"][45].C);
    expect(result.items[3].commodity_code).toBe(packingListJson["ARGO"][46].C);
    expect(result.items[2].number_of_packages).toBe(
      packingListJson["ARGO"][45].H,
    );
    expect(result.items[3].number_of_packages).toBe(
      packingListJson["ARGO"][46].H,
    );
    expect(result.items[2].total_net_weight_kg).toBe(
      packingListJson["ARGO"][45].K,
    );
    expect(result.items[3].total_net_weight_kg).toBe(
      packingListJson["ARGO"][46].K,
    );
  });

  test("parses null json", () => {
    const packingListJson = {
      "Cust Ord": [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          A: "Item",
          B: "Product code",
          C: "Commodity code",
          D: "Online Check",
          E: "Meursing code",
          F: "Description of goods",
          G: "Country of Origin",
          H: "No. of pkgs",
          I: "Type of pkgs",
          J: "Total Gross Weight",
          K: "Total Net Weight",
          L: "Total Line Value",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
        },
        {
          A: "1",
          B: "6535096",
          D: "",
          E: "",
          G: "",
          I: "Cases",
          J: "25.119",
          L: "55.40",
          O: "G",
        },
      ],
    };
    const result = fowlerWelchParser2.parse(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("conditionsForParser", () => {
  test("if type is a string with length 0 it should return null", () => {
    const str = "";
    expect(isNullOrEmptyOrSpace(str)).toBeNull();
  });

  test("if type is a string with just space it should return null", () => {
    const str = " ";
    expect(isNullOrEmptyOrSpace(str)).toBeNull();
  });
  test("if type is null return null", () => {
    const str = null;
    expect(isNullOrEmptyOrSpace(str)).toBeNull();
  });
  test("if type is a valid string return said string", () => {
    const str = "salads";
    expect(isNullOrEmptyOrSpace(str)).toBe("salads");
  });
});
