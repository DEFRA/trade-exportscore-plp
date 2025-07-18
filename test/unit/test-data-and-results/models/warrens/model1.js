const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
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
        M: "RMS-GB-000174-002",
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
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  validModel_Multiple: {
    sheet: [
      {
        C: "Commodity code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
      },
      {
        A: "1",
        B: "6535096",
        C: "0702000007",
        D: "",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "France",
        H: "32",
        I: "Cases",
        J: "25.119",
        K: "336",
        L: "55.40",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
      {
        A: "2",
        B: "4488002",
        C: "0702000007",
        D: "Check - 2005800099",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "France",
        H: "39",
        I: "Cases",
        J: "882.057",
        K: "351",
        L: "3511",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
    ],
    sheet2: [
      {
        C: "Commodity code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
      },
      {
        A: "1",
        B: "6535096",
        C: "2005800099",
        D: "",
        E: "",
        F: "Sweetcorn Express 8x2",
        G: "France",
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
        G: "France",
        H: "65",
        I: "Cases",
        J: "882.057",
        K: "780.000",
        L: "2195.05",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
    ],
  },
  validHeadersNoData: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
        M: "NIIRMS Dispatch number",
        N: "Treatment Type (Chilled /Ambient)",
        O: "NIRMS Lane (R/G)",
        P: "Secondary Qty",
        Q: "Cert Type Req",
        R: "Cert Number",
      },
    ],
  },
  invalid_Model_IncorrectHeader: {
    sheet: [
      {
        C: "THIS",
        F: "IS",
        H: "NOT",
        K: "VALID",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
      },
      {
        A: "1",
        B: "6535096",
        C: "0702000007",
        D: "",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "",
        H: "32",
        I: "Cases",
        J: "25.119",
        K: "336",
        L: "55.40",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
      {
        A: "2",
        B: "4488002",
        C: "0702000007",
        D: "Check - 2005800099",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "",
        H: "39",
        I: "Cases",
        J: "882.057",
        K: "351",
        L: "3511",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
    ],
  },
  invalid_Model_IncorrectHeaderMultiple: {
    sheet: [
      {
        C: "THIS",
        F: "IS",
        H: "NOT",
        K: "VALID",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
      },
      {
        A: "1",
        B: "6535096",
        C: "0702000007",
        D: "",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "",
        H: "32",
        I: "Cases",
        J: "25.119",
        K: "336",
        L: "55.40",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
      {
        A: "2",
        B: "4488002",
        C: "0702000007",
        D: "Check - 2005800099",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "",
        H: "39",
        I: "Cases",
        J: "882.057",
        K: "351",
        L: "3511",
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
    ],
    sheet2: [
      {
        C: "THIS",
        F: "IS",
        H: "NOT",
        K: "VALID",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
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
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
      },
    ],
  },
  invalid_Model_IncorrectEstablishmentNumber: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
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
        M: "INVALID",
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
        M: "INVALID",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  invalid_Model_IncorrectEstablishmentNumberMultiple: {
    sheet: [
      {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
      },
      {
        A: "1",
        B: "6535096",
        C: "0702000007",
        D: "",
        E: "",
        F: "Nightingale Cherry Tomatoes TS 42x250g",
        G: "",
        H: "32",
        I: "Cases",
        J: "25.119",
        K: "336",
        L: "55.40",
        M: "INVALID",
        N: "Chilled",
        O: "G",
      },
      {
        A: "2",
        B: "4488002",
        C: "0702000007",
        D: "Check - 2005800099",
        E: "",
        F: "Cherry Tomatoes TS Core 30x300G",
        G: "",
        H: "39",
        I: "Cases",
        J: "882.057",
        K: "351",
        L: "3511",
        M: "INVALID",
        N: "Chilled",
        O: "G",
      },
    ],
    sheet2: [
      {
        C: "Commodity code",
        F: "Description of goods",
        H: "No. of pkgs",
        K: "Item Net Weight (kgs)",
        N: "Treatment Type (Chilled /Ambient)",
        M: "NIIRMS Dispatch number",
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
        M: "INVALID",
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
        M: "INVALID",
        N: "Chilled",
        O: "G",
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
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
        K: null,
        L: "712.32",
        M: "RMS-GB-000174-002",
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
        M: "RMS-GB-000174-002",
        N: null,
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  emptyModel: {
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
        K: "Total Net Weight (kgs)",
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
  },
  multipleRms: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight \n(7921.700kgs)",
        L: "Total Line Value \n(41662.4)",
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
        M: "RMS-GB-000174-002",
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
        M: "RMS-GB-000174-003",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  missingKgunit: {
    "Customer Order": [
      {
        A: "Item",
        B: "Product code",
        C: "Commodity code",
        D: "Online Check",
        E: "Meursing code",
        F: "Description of goods",
        G: "Country of Origin",
        H: "No. of pkgs \n(1547)",
        I: "Type of pkgs",
        J: "Total Gross Weight \n(11015.700kgs)",
        K: "Total Net Weight",
        L: "Total Line Value \n(41662.4)",
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
        M: "RMS-GB-000174-002",
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
        M: "RMS-GB-000174-002",
        N: "Chilled",
        O: "G",
        P: "",
        Q: "",
        R: "",
      },
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "0702000007",
        description: "Nightingale Cherry Tomatoes TS 42x250g",
        nature_of_products: null,
        number_of_packages: "32",
        total_net_weight_kg: "336",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "0702000007",
        description: "Cherry Tomatoes TS Core 30x300G",
        nature_of_products: null,
        number_of_packages: "39",
        total_net_weight_kg: "351",
        type_of_treatment: "Chilled",
      },
    ],
    registration_approval_number: "RMS-GB-000174-002",
    parserModel: parserModel.WARRENS1,
  },
  validTestResultMultiple: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "0702000007",
        description: "Nightingale Cherry Tomatoes TS 42x250g",
        nature_of_products: null,
        number_of_packages: "32",
        total_net_weight_kg: "336",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "0702000007",
        description: "Cherry Tomatoes TS Core 30x300G",
        nature_of_products: null,
        number_of_packages: "39",
        total_net_weight_kg: "351",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "2005800099",
        description: "Sweetcorn Express 8x2",
        nature_of_products: null,
        number_of_packages: "5",
        total_net_weight_kg: "20.000",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "2005800099",
        description: "Sweetcorn Cobettes 24x4",
        nature_of_products: null,
        number_of_packages: "65",
        total_net_weight_kg: "780.000",
        type_of_treatment: "Chilled",
      },
    ],
    registration_approval_number: "RMS-GB-000174-002",
    parserModel: parserModel.WARRENS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "0702000007",
        description: "Nightingale Cherry Tomatoes TS 42x250g",
        nature_of_products: null,
        number_of_packages: "32",
        total_net_weight_kg: null,
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "0702000007",
        description: "Cherry Tomatoes TS Core 30x300G",
        nature_of_products: null,
        number_of_packages: "39",
        total_net_weight_kg: "351",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000174-002",
    parserModel: parserModel.WARRENS1,
  },
};
