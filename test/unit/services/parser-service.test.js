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

describe("combineParser", () => {
  test("parses json", () => {
    const registrationApprovalNumber = "test";
    const items = [
      {
        description: "test desc",
        nature_of_products: "products",
        type_of_treatment: "teatment",
        commodity_code: 123,
        number_of_packages: 1,
        total_net_weight_kg: 1.2,
      },
    ];
    const packingListJson = {
      registration_approval_number: registrationApprovalNumber,
      items,
      business_checks: {
        all_required_fields_present: true,
      },
    };
    const result = parserService.combineParser(
      registrationApprovalNumber,
      items,
      true,
    );
    expect(result).toMatchObject(packingListJson);
  });
});

describe("matchesAsda", () => {
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
    const result = parserService.matchesAsda(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xls";
    const result = parserService.matchesAsda(packingListJson, filename);
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
    const result = parserService.matchesAsda(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extension for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesAsda(packingListJson, filename);
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
    const result = parserService.matchesAsda(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseAsda", () => {
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
    const result = parserService.parseAsda(packingListJson);
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
        E: "RMS-NI-000008-017",
      },
    ];
    const result = parserService.parseAsda(packingListJson);
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

describe("matchesFowlerWelch", () => {
  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesFowlerWelch(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong extension for incorrect file extension", () => {
    const filename = "packinglist.xls";
    const packingListJson = {};
    const result = parserService.matchesFowlerWelch(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      "Customer Order": [
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
        {},
        {
          M: "Incorrect",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesFowlerWelch(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("returns wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Customer Order": [
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
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
          D: "Online Check",
          E: "Meursing Code",
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
          P: "Secondary Qty",
          Q: "Cert Type Req",
          R: "Cert Number",
        },
        {
          M: "RMS-GB-000216-004",
        },
      ],
    };
    const result = parserService.matchesFowlerWelch(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });

  test("returns true", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      "Customer Order": [
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
          H: "No. of pkgs \r\n(1547)",
          I: "Type of pkgs",
          J: "Total Gross Weight \r\n(11015.700kgs)",
          K: "Total Net Weight \r\n(7921.700kgs)",
          L: "Total Line Value \r\n(41662.4)",
          M: "NIIRMS Dispatch number",
          N: "Treatment Type (Chilled /Ambient)",
          O: "NIRMS Lane (R/G)",
          P: "Secondary Qty",
          Q: "Cert Type Req",
          R: "Cert Number",
        },
        {
          M: "RMS-GB-000216-004",
        },
      ],
    };
    const result = parserService.matchesFowlerWelch(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });
});

describe("parseFowlerWelch", () => {
  test("parses json", () => {
    const packingListJson = [
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
        H: "No. of pkgs \r\n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \r\n(11015.700kgs)",
        K: "Total Net Weight \r\n(7921.700kgs)",
        L: "Total Line Value \r\n(41662.4)",
        M: "NIIRMS Dispatch number",
        N: "Treatment Type (Chilled /Ambient)",
        O: "NIRMS Lane (R/G)",
        P: "Secondary Qty",
        Q: "Cert Type Req",
        R: "Cert Number",
      },
      {
        A: "1",
        B: "1582084",
        C: "0702000007",
        D: "Check - 0702000007",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "Morocco",
        H: "32",
        I: "Cases",
        J: "400",
        K: "336",
        L: "712.32",
        M: "RMS-GB-000216-004",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
      {
        A: "2",
        B: "3153779",
        C: "0702000007",
        D: "Check - 0702000007",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "Morocco",
        H: "39",
        I: "Cases",
        J: "429",
        K: "351",
        L: "889.2",
        M: "RMS-GB-000216-004",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ];

    const result = parserService.parseFowlerWelch(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[45].M);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[45].F);
    expect(result.items[1].description).toBe(packingListJson[46].F);
    expect(result.items[0].commodity_code).toBe(packingListJson[45].C);
    expect(result.items[1].commodity_code).toBe(packingListJson[46].C);
    expect(result.items[0].number_of_packages).toBe(packingListJson[45].H);
    expect(result.items[1].number_of_packages).toBe(packingListJson[46].H);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[45].K);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[46].K);
  });

  test("parses null json", () => {
    const packingListJson = [
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
        H: "No. of pkgs \r\n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \r\n(11015.700kgs)",
        K: "Total Net Weight \r\n(7921.700kgs)",
        L: "Total Line Value \r\n(41662.4)",
        M: "NIIRMS Dispatch number",
        N: "Treatment Type (Chilled /Ambient)",
        O: "NIRMS Lane (R/G)",
        P: "Secondary Qty",
        Q: "Cert Type Req",
        R: "Cert Number",
      },
      {
        A: "1",
        B: "1582084",
        D: "Check - 0702000007",
        E: "",
        G: "Morocco",
        I: "Cases",
        J: "400",
        L: "712.32",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ];

    const result = parserService.parseFowlerWelch(packingListJson);
    expect(result.registration_approval_number).toBeNull();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBeNull();
    expect(result.items[0].commodity_code).toBeNull();
    expect(result.items[0].number_of_packages).toBeNull();
    expect(result.items[0].total_net_weight_kg).toBeNull();
  });
});

describe("matchesNisa", () => {
  test("returns true", () => {
    const filename = "PackingList.xlsx";
    const packingListJson = {
      Something: [
        {
          A: "RMS_ESTABLISHMENT_NO",
          I: "PRODUCT_TYPE_CATEGORY",
          K: "PART_NUMBER_DESCRIPTION",
          L: "TARIFF_CODE_EU",
          M: "PACKAGES",
          O: "NET_WEIGHT_TOTAL",
        },
        {
          A: "RMS-GB-000025-009",
        },
      ],
    };
    const result = parserService.matchesNisa(packingListJson, filename);
    expect(result).toBe(MatcherResult.CORRECT);
  });

  test("returns generic error for empty json", () => {
    const packingListJson = {};
    const filename = "packinglist.xlsx";
    const result = parserService.matchesNisa(packingListJson, filename);
    expect(result).toBe(MatcherResult.GENERIC_ERROR);
  });

  test("returns wrong establishment number for missing establishment number", () => {
    const packingListJson = {
      Something: [
        {},
        {
          A: "INCORRECT",
        },
      ],
    };
    const filename = "packinglist.xlsx";
    const result = parserService.matchesNisa(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_ESTABLISHMENT_NUMBER);
  });

  test("return wrong extensions for incorrect file extension", () => {
    const filename = "packinglist.pdf";
    const packingListJson = {};
    const result = parserService.matchesNisa(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_EXTENSIONS);
  });

  test("return wrong header for incorrect header values", () => {
    const filename = "packinglist.xlsx";
    const packingListJson = {
      Something: [
        {
          A: "NOT",
          B: "CORRECT",
          C: "HEADER",
        },
        {
          A: "RMS-GB-000025-009",
        },
      ],
    };
    const result = parserService.matchesNisa(packingListJson, filename);
    expect(result).toBe(MatcherResult.WRONG_HEADER);
  });
});

describe("parseNisa", () => {
  test("parses json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: 2,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "CO OP BROCCOLI",
        L: "0403209300",
        M: 1,
        O: 2,
      },
    ];

    const result = parserService.parseNisa(packingListJson);
    expect(result.registration_approval_number).toBe(packingListJson[1].A);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].description).toBe(packingListJson[1].K);
    expect(result.items[1].description).toBe(packingListJson[2].K);
    expect(result.items[0].nature_of_products).toBe(packingListJson[1].I);
    expect(result.items[1].nature_of_products).toBe(packingListJson[2].I);
    expect(result.items[0].commodity_code).toBe(packingListJson[1].L);
    expect(result.items[1].commodity_code).toBe(packingListJson[2].L);
    expect(result.items[0].number_of_packages).toBe(packingListJson[1].M);
    expect(result.items[1].number_of_packages).toBe(packingListJson[2].M);
    expect(result.items[0].total_net_weight_kg).toBe(packingListJson[1].O);
    expect(result.items[1].total_net_weight_kg).toBe(packingListJson[2].O);
  });

  test("parses null json", () => {
    const packingListJson = [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {},
    ];

    const result = parserService.parseNisa(packingListJson);
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
