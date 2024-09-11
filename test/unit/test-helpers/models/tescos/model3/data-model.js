const ParserModel = require("../../../../../../app/services/parser-model");

module.exports = {
  validModel: {
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
    ],
  },
  invalidModel_MissingColumnCells: {
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
      {
        A: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        B: "4015900000",
        C: null,
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
        G: null,
      },
    ],
  },
  emptyModel: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        E: null,
      },
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "4015900000",
        description: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.437,
        type_of_treatment: "AMBIENT",
      },
      {
        commodity_code: "0401401090",
        description: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 5.396,
        type_of_treatment: "AMBIENT",
      },
    ],
    registration_approval_number: "RMS-GB-000022-999",
    parserModel: ParserModel.TESCO3,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "4015900000",
        description: "1 MARIGOLD EXTRA LIFE GLOVES KITCHEN MEDIUM",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.437,
        type_of_treatment: null,
      },
      {
        commodity_code: "0401401090",
        description: "APTAMIL 1 1ST MILK 200ML RTF LIQD",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: null,
        type_of_treatment: "AMBIENT",
      },
    ],
    registration_approval_number: "RMS-GB-000022-999",
    parserModel: ParserModel.TESCO3,
  },
};
