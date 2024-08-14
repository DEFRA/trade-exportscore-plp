const parserService = require("../../../app/services/parser-service");
const MatcherResult = require("../../../app/services/matches-result");

describe("matchesBandM", () => {
  test("returns correct", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet1: [
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
      ],
    };
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet1: [
        {},
        {},
        {
          H: "WAREHOUSE SCHEME NUMBER:",
          I: "RMS-GB-000005-001",
        },
        {},
        {},
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };
    const result = parserService.matchesBandM(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseBandM", () => {
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
    const result = parserService.parseBandM(packingListJson);
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
    const result = parserService.parseBandM(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("failedParser", () => {
  test("parses json", () => {
    const packingListJson = {
      registration_approval_number: null,
      items: [],
      business_checks: {
        all_required_fields_present: false,
      },
    };
    const result = parserService.failedParser();
    expect(result).toMatchObject(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toMatchObject([]);
    expect(result.business_checks.all_required_fields_present).toBeFalsy();
  });
});

describe("matchesAsdaModel1", () => {
  test("returns true", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "[Description Of All Retail Goods]",
          B: "[Nature Of Product]",
          C: "[Treatment Type]",
          D: "[Number Of Establishment]",
          E: "[Destination Store Establishment Number]",
          F: "[Number of Packages]",
          G: "[Net Weight]",
          H: "[kilograms/grams]",
        },
        {
          D: "RMS-GB-000015-001",
        },
      ],
    };
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      PackingList_Extract: [
        {},
        {},
        {
          I: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      PackingList_Extract: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          D: "RMS-GB-000015-001",
        },
      ],
    };
    const result = parserService.matchesAsdaModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseAsdaModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        A: "169 STOREY TREEHOUSE",
        B: "BOOKS",
        C: "GM",
        D: "RMS-GB-000015-006",
        E: "RMS-NI-000008-017",
        F: 2,
        G: 0.38,
        H: "kgs",
      },
      {
        A: "19 CRIMES",
        B: "WINES",
        C: "AMBIENT",
        D: "RMS-GB-000015-006",
        E: "RMS-NI-000008-017",
        F: 1,
        G: 0.3457,
        H: "kgs",
      },
    ];
    const result = parserService.parseAsdaModel1(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[1].D);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].A);
    expect(result.items[1].description).toBe(packingListJson[2].A);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].B);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].B);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[1].C);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[2].C);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].F);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].F);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].G);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].G);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        A: "[Description Of All Retail Goods]",
        B: "[Nature Of Product]",
        C: "[Treatment Type]",
        D: "[Number Of Establishment]",
        E: "[Destination Store Establishment Number]",
        F: "[Number of Packages]",
        G: "[Net Weight]",
        H: "[kilograms/grams]",
      },
      {
        D: null,
      },
    ];
    const result = parserService.parseAsdaModel1(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("matchesTescoModel1", () => {
  test("returns true", () => {
    const filename = "PackingListTesco1.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          AT: "RMS-GB-000022-998",
        },
        {
          G: "Product/ Part Number description",
          L: "Tariff Code UK",
          AS: "Treatment Type",
          AT: "Green Lane",
          BR: "Packages",
          BT: "Gross Weight",
          BU: "Net Weight",
        },
      ],
    };
    const result = parserService.matchesTescoModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesTescoModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          AT: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesTescoModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesTescoModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          AT: "RMS-GB-000022-001",
        },
        {
          G: "NOT",
          L: "CORRECT",
          AS: "HEADER",
          AT: "Green Lane",
          BR: "Packages",
          BT: "Gross Weight",
          BU: "Net Weight",
        },
      ],
    };
    const result = parserService.matchesTescoModel1(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseTescoModel1", () => {
  test("parses json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {
        AT: "RMS-GB-000022-998",
      },
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        G: "CONTIGO AUTO-POP BOTTLE 720ML",
        L: "9617000000",
        AS: "Ambient",
        AT: "Y",
        BR: "1",
        BT: "1.49",
        BU: "1.4155",
      },
      {
        G: "JOIE MEASURING SPOONS",
        L: "3924100090",
        AS: "Ambient",
        AT: "Y",
        BR: "1",
        BT: "0.84",
        BU: "0.798",
      },
    ];
    const result = parserService.parseTescoModel1(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[3].AT);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[5].G);
    expect(result.items[1].description).toBe(packingListJson[6].G);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[5].AS);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[6].AS);
    expect(result.items[0].commodity_code).toBe(packingListJson[5].L);
    expect(result.items[1].commodity_code).toBe(packingListJson[6].L);
    expect(result.items[0].number_of_packages).toBe(packingListJson[5].BR);
    expect(result.items[1].number_of_packages).toBe(packingListJson[6].BR);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[5].BU);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[6].BU);
  });

  test("parses null json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {},
      {
        G: "Product/ Part Number description",
        L: "Tariff Code UK",
        AS: "Treatment Type",
        AT: "Green Lane",
        BR: "Packages",
        BT: "Gross Weight",
        BU: "Net Weight",
      },
      {
        AT: "Y",
      },
    ];
    const result = parserService.parseTescoModel1(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("matchesTescoModel2", () => {
  test("returns true", () => {
    const filename = "PackingListTesco2.xlsx";
    const packingListJson = {
      Sheet2: [
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
          M: "GB Establishment RMS Number",
        },
        {},
        {
          M: "RMS-GB-000015-009",
        },
      ],
    };
    const result = parserService.matchesTescoModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesTescoModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet2: [
        {},
        {},
        {
          M: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesTescoModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extensions for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesTescoModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet2: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {},
        {
          M: "RMS-GB-000015-009",
        },
      ],
    };
    const result = parserService.matchesTescoModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

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
    const result = parserService.parseTescoModel2(packingListJson);
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
    const result = parserService.parseTescoModel2(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("matchesTescoModel3", () => {
  test("returns true", () => {
    const filename = "PackingListTesco3.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "RMS-GB-000022-999",
        },
        {
          A: "Product/ Part Number description",
          B: "Tariff Code UK",
          C: "Treatment Type",
          D: "Green Lane",
          E: "Packages",
          F: "Gross Weight",
          G: "Net Weight",
        },
      ],
    };
    const result = parserService.matchesTescoModel3(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesTescoModel3(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesTescoModel3(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesTescoModel3(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Input Data Sheet": [
        {},
        {},
        {},
        {
          E: "RMS-GB-000022-001",
        },
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Green Lane",
          E: "Packages",
          F: "Gross Weight",
          G: "Net Weight",
        },
      ],
    };
    const result = parserService.matchesTescoModel3(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseTescoModel3", () => {
  test("parses json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {
        E: "RMS-GB-000022-999",
      },
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        A: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        B: "4015900000",
        C: "AMBIENT",
        D: "Y",
        E: 1,
        F: 0.46,
        G: 0.437,
      },
      {
        A: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        B: "0401401090",
        C: "AMBIENT",
        D: "Y",
        E: 2,
        F: 5.68,
        G: 5.396,
      },
    ];
    const result = parserService.parseTescoModel3(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[3].E);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[5].A);
    expect(result.items[1].description).toBe(packingListJson[6].A);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[5].C);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[6].C);
    expect(result.items[0].commodity_code).toBe(packingListJson[5].B);
    expect(result.items[1].commodity_code).toBe(packingListJson[6].B);
    expect(result.items[0].number_of_packages).toBe(packingListJson[5].E);
    expect(result.items[1].number_of_packages).toBe(packingListJson[6].E);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[5].G);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[6].G);
  });

  test("parses null json", () => {
    const packingListJson = [
      {},
      {},
      {},
      {},
      {
        A: "Product/ Part Number description",
        B: "Tariff Code UK",
        C: "Treatment Type",
        D: "Green Lane",
        E: "Packages",
        F: "Gross Weight",
        G: "Net Weight",
      },
      {
        E: null,
      },
    ];
    const result = parserService.parseTescoModel3(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("matchesSainsburys", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesSainsburys(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong extensions for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesSainsburys(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          N: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesSainsburys(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Product / Part Number",
          E: "Product / Part Number Description",
          F: "Packed Singles",
          G: "Packages",
          H: "Net\r\nWeight / Package KG",
          I: "Gross\r\nWeight / Package KG",
          J: "Packaging Type",
          K: "Excise Code",
          L: "Final Destination ID",
          M: "Dispatch Unit ID",
          N: "RMS Number (based on depot)",
          O: "Commodity Code",
        },
        {
          N: "RMS-GB-000094-001",
        },
      ],
    };
    const result = parserService.matchesSainsburys(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns true", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Sheet1: [
        {
          A: "Delivery Date",
          B: "Load Ref\r\n(Trailer Number)",
          C: "Product Type / Category",
          D: "Product / Part Number",
          E: "Product / Part Number Description",
          F: "Packed Singles",
          G: "Packages",
          H: "Net\r\nWeight / Package KG",
          I: "Gross\r\nWeight / Package KG",
          J: "Packaging Type",
          K: "Excise Code",
          L: "Final Destination ID",
          M: "Dispatch Unit ID",
          N: "RMS Number (based on depot)",
          O: "Commodity Code",
        },
        {
          N: "RMS-GB-000094-001",
        },
      ],
    };
    const result = parserService.matchesSainsburys(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});

describe("parseSainsburys", () => {
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

describe("matchesTjmorris", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";
    const result = parserService.matchesTjmorris(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesTjmorris(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          A: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xls";
    const result = parserService.matchesTjmorris(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Seal",
          E: "Store",
          F: "STORENAME",
          G: "Order",
          H: "Cage/Ref",
          I: "Group",
          J: "TREATMENTTYPE",
          K: "Sub-Group",
          L: "Description",
          M: "Item",
          N: "Description",
          O: "Tariff/Commodity",
          P: "Cases",
          Q: "Gross Weight Kg",
          R: "Net Weight Kg",
          S: "Cost",
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };
    const result = parserService.matchesTjmorris(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns true", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
          C: "Trailer",
          D: "Seal",
          E: "Store",
          F: "STORENAME",
          G: "Order",
          H: "Cage/Ref",
          I: "Group",
          J: "TREATMENTTYPE",
          K: "Sub-Group",
          L: "Description",
          M: "Item",
          N: "Description",
          O: "Tariff/Commodity",
          P: "Cases",
          Q: "Gross Weight Kg",
          R: "Net Weight Kg",
          S: "Cost",
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
        },
      ],
    };
    const result = parserService.matchesTjmorris(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});

describe("parseTjmorris", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "SANDWICHES",
        N: "28 TUNA CRUNCH TIGER ROLL",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {
        A: "RMS-GB-000010-001",
        J: "CHILLED",
        L: "Description",
        N: "Description",
        O: "0408192000",
        P: "2",
        R: "1.4",
      },
      {
        A: "RMS-GB-000010-001",
        J: "FRESH PRODUCTS",
        L: "LETTUCE & BAGGED SALADS",
        N: "FLORETTE SWEET & CRUNCHY 250G",
        O: "1602906100",
        P: "4",
        R: "8",
      },
    ];

    const result = parserService.parseTjmorris(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].N);
    expect(result.items[1].description).toBe(packingListJson[2].N);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].L);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].L);
    expect(result.items[0].commodity_code).toBe(packingListJson[1].O);
    expect(result.items[1].commodity_code).toBe(packingListJson[2].O);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].P);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].P);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].R);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].R);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        A: "Consignor / Place o f Despatch",
        J: "TREATMENTTYPE",
        L: "Description",
        N: "Description",
        O: "Tariff/Commodity",
        P: "Cases",
        R: "Net Weight Kg",
      },
      {},
    ];

    const result = parserService.parseTjmorris(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("checkRequiredData", () => {
  test("missing remos number", () => {
    const packingList = {
      registration_approval_number: null,
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "type of treatment",
          commodity_code: "012345",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing commodity code", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing treatment type", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: null,
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing nature of products", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: null,
          type_of_treatment: "treatment type",
          commodity_code: null,
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing description", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: null,
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing packages", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: null,
          total_net_weight_kg: 1.2,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });

  test("missing net weight", () => {
    const packingList = {
      registration_approval_number: "remos",
      items: [
        {
          description: "description",
          nature_of_products: "nature of products",
          type_of_treatment: "treatment type",
          commodity_code: "123",
          number_of_packages: 1,
          total_net_weight_kg: null,
        },
      ],
      business_checks: {
        all_required_fields_present: true,
      },
    };

    const result = parserService.checkRequiredData(packingList);

    expect(result).toBeFalsy();
  });
});

describe("findParser", () => {
  test("removes empty items", () => {
    const packingListJson = {
      Sheet1: [
        {
          A: "Consignor / Place o f Despatch",
          B: "CONSIGNEE",
          C: "Trailer",
          D: "Seal",
          E: "Store",
          F: "STORENAME",
          G: "Order",
          H: "Cage/Ref",
          I: "Group",
          J: "TREATMENTTYPE",
          K: "Sub-Group",
          L: "Description",
          M: "Item",
          N: "Description",
          O: "Tariff/Commodity",
          P: "Cases",
          Q: "Gross Weight Kg",
          R: "Net Weight Kg",
          S: "Cost",
          T: "Country of Origin",
          U: "VAT Status",
          V: "SPS",
          W: "Consignment ID",
          X: "Processed?",
          Y: "Created Timestamp",
        },
        {
          A: "RMS-GB-000010-001",
          J: "CHILLED",
          L: "Description",
          N: "Description",
          O: "0408192000",
          P: "2",
          R: "1.4",
        },
        {
          A: null,
          J: null,
          L: null,
          N: null,
          O: null,
          P: null,
          R: null,
        },
        {
          A: "RMS-GB-000010-001",
          J: "FRESH PRODUCTS",
          L: "LETTUCE & BAGGED SALADS",
          N: "FLORETTE SWEET & CRUNCHY 250G",
          O: "1602906100",
          P: "4",
          R: "8",
        },
      ],
    };
    const filename = "packinglist.xls";

    const result = parserService.findParser(packingListJson, filename);
    expect(result.packingList.items).toHaveLength(2);
  });
});

describe("matchesAsdaModel2", () => {
  test("returns true", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          B: "[Description Of All Retail Go",
          D: "[Nature Of Product]",
          F: "[Treatment Ty",
          H: "Establishment Number",
          J: "Cases",
          L: "Case Weight",
          N: "NET Weight",
        },
        {
          H: "RMS-GB-000015-010",
        },
      ],
    };
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Sheet1: [
        {},
        {
          H: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xls";
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xls";
    const packingListJson = {
      Sheet1: [
        {
          B: "NOT",
          D: "CORRECT",
          F: "HEADER",
        },
        {
          H: "RMS-GB-000015-010",
        },
      ],
    };
    const result = parserService.matchesAsdaModel2(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseAsdaModel2", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {
        B: "4PK X 17 PINK LADY APPLES",
        D: "TOP FRUIT",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 20,
        L: 12.75,
        N: 255,
      },
      {
        B: "ASDA BABY WATERMELON X10",
        D: "MELON HARD",
        F: "PRODUCE",
        H: "RMS-GB-000015-010",
        J: 5,
        L: 12,
        N: 60,
      },
    ];
    const result = parserService.parseAsdaModel2(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[1].H);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].B);
    expect(result.items[1].description).toBe(packingListJson[2].B);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].D);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].D);
    expect(result.items[0].type_of_treatment).toBe(packingListJson[1].F);
    expect(result.items[1].type_of_treatment).toBe(packingListJson[2].F);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].J);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].J);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].N);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].N);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        B: "[Description Of All Retail Go",
        D: "[Nature Of Product]",
        F: "[Treatment Ty",
        H: "Establishment Number",
        J: "Cases",
        L: "Case Weight",
        N: "NET Weight",
      },
      {},
    ];
    const result = parserService.parseAsdaModel2(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("matchesBuffaloadLogistics", () => {
  test("returns true", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      Tabelle1: [
        {
          B: "RMS-GB-000098-001",
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
      ],
    };
    const result = parserService.matchesBuffaloadLogistics(
      packingListJson,
      filename,
    );
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesBuffaloadLogistics(
      packingListJson,
      filename,
    );
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Tabelle1: [
        {
          B: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesBuffaloadLogistics(
      packingListJson,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extensions for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesBuffaloadLogistics(
      packingListJson,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Tabelle1: [
        {
          B: "RMS-GB-000098-001",
        },
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
      ],
    };
    const result = parserService.matchesBuffaloadLogistics(
      packingListJson,
      filename,
    );
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseBuffaloadLogistics", () => {
  test("parses json", () => {
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
        H: "Treatment Type (Chilled /Ambient) ",
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

    const result = parserService.parseBuffaloadLogistics(packingListJson);
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
  });

  test("parses null json", () => {
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
        H: "Treatment Type (Chilled /Ambient) ",
        I: "NIRMS Lane (R/G)",
      },
      {},
    ];

    const result = parserService.parseBuffaloadLogistics(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].type_of_treatment).toBeNull();
    expect(result.items[0].nature_of_products).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});
