const Parser = require("../../../../../../app/services/parsers/warrens/model1/parser");
const ParserModel = require("../../../../../../app/services/parser-model");

describe("parseWarrensModel1", () => {
  test("parses json", () => {
    const packingListJson = {
      sheet: [
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
          L: "Item value",
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
          M: "RMS-GB-000174-002",
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
    const result = Parser.parse(packingListJson);
    expect(result.registration_approval_number).toBe(
      packingListJson["sheet"][1].M,
    );
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson["sheet"][1].F);
    expect(result.items[1].description).toBe(packingListJson["sheet"][2].F);
    expect(result.items[0].commodity_code).toBe(packingListJson["sheet"][1].C);
    expect(result.items[1].commodity_code).toBe(packingListJson["sheet"][2].C);
    expect(result.items[0].number_of_packages).toBe(
      packingListJson["sheet"][1].H,
    );
    expect(result.items[1].number_of_packages).toBe(
      packingListJson["sheet"][2].H,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      packingListJson["sheet"][1].K,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      packingListJson["sheet"][2].K,
    );
    expect(result.items[0].type_of_treatment).toBe(
      packingListJson["sheet"][1].N,
    );
    expect(result.items[1].type_of_treatment).toBe(
      packingListJson["sheet"][2].N,
    );
    expect(result.parserModel).toBe(ParserModel.WARRENS1);
  });

  test("parses multiple sheets", () => {
    const packingListJson = {
      sheet: [
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
          L: "Item value",
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
      sheet2: [
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
          L: "Item value",
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
    const result = Parser.parse(packingListJson);
    expect(result.registration_approval_number).toBe(
      packingListJson["sheet"][1].M,
    );
    expect(result.items).toHaveLength(4);
    expect(result.items[0].description).toBe(packingListJson["sheet"][1].F);
    expect(result.items[1].description).toBe(packingListJson["sheet"][2].F);
    expect(result.items[0].commodity_code).toBe(packingListJson["sheet"][1].C);
    expect(result.items[1].commodity_code).toBe(packingListJson["sheet"][2].C);
    expect(result.items[0].number_of_packages).toBe(
      packingListJson["sheet"][1].H,
    );
    expect(result.items[1].number_of_packages).toBe(
      packingListJson["sheet"][2].H,
    );
    expect(result.items[0].total_net_weight_kg).toBe(
      packingListJson["sheet"][1].K,
    );
    expect(result.items[1].total_net_weight_kg).toBe(
      packingListJson["sheet"][2].K,
    );
    expect(result.items[0].type_of_treatment).toBe(
      packingListJson["sheet"][1].N,
    );
    expect(result.items[1].type_of_treatment).toBe(
      packingListJson["sheet"][2].N,
    );

    expect(result.items[2].description).toBe(packingListJson["sheet2"][1].F);
    expect(result.items[3].description).toBe(packingListJson["sheet2"][2].F);
    expect(result.items[2].commodity_code).toBe(packingListJson["sheet2"][1].C);
    expect(result.items[3].commodity_code).toBe(packingListJson["sheet2"][2].C);
    expect(result.items[2].number_of_packages).toBe(
      packingListJson["sheet2"][1].H,
    );
    expect(result.items[3].number_of_packages).toBe(
      packingListJson["sheet2"][2].H,
    );
    expect(result.items[2].total_net_weight_kg).toBe(
      packingListJson["sheet2"][1].K,
    );
    expect(result.items[3].total_net_weight_kg).toBe(
      packingListJson["sheet2"][2].K,
    );
    expect(result.items[2].type_of_treatment).toBe(
      packingListJson["sheet2"][1].N,
    );
    expect(result.items[3].type_of_treatment).toBe(
      packingListJson["sheet2"][2].N,
    );
    expect(result.parserModel).toBe(ParserModel.WARRENS1);
  });

  test("parses null json", () => {
    const packingListJson = {
      sheet: [
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
          L: "Item value",
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
          O: "G",
        },
      ],
    };
    const result = Parser.parse(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.parserModel).toBe(ParserModel.WARRENS1);
  });
});
