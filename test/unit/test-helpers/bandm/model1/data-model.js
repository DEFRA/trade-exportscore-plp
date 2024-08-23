const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
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
    ],
  },
  invalidModel_MissingColumnCells: {
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
      {
        A: 412267,
        B: 10145600,
        C: "J/L JERKY 70G TERIYAKI",
        D: null,
        E: "RMS-GB-000005-001",
        F: 1,
        G: null,
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
    ],
  },
  emptyModel: {
    Sheet1: [
      {},
      {},
      {
        H: "WAREHOUSE SCHEME NUMBER:",
        I: null,
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
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: 16025095,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.15,
        type_of_treatment: null,
      },
      {
        commodity_code: 19053199,
        description: "MINI ROLLS 10PK",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 3.27,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: ParserModel.BANDM1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
      {
        commodity_code: 19053199,
        description: "MINI ROLLS 10PK",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 3.27,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: ParserModel.BANDM1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [],
    registration_approval_number: null,
    parserModel: ParserModel.BANDM1,
  },
};
