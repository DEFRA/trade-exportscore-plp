const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
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
    ],
  },
  invalidModel_MissingColumnCells: {
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
      {
        G: "CONTIGO AUTO-POP BOTTLE 720ML",
        L: "9617000000",
        AS: "Ambient",
        AT: "Y",
        BR: "1",
        BT: "1.49",
        BU: null,
      },
      {
        G: "JOIE MEASURING SPOONS",
        L: "3924100090",
        AS: null,
        AT: "Y",
        BR: "1",
        BT: "0.84",
        BU: "0.798",
      },
    ],
  },
  emptyModel: {
    "Input Data Sheet": [
      {},
      {},
      {},
      {
        AT: null,
      },
    ],
  },
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: "1.4155",
        type_of_treatment: "Ambient",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: "0.798",
        type_of_treatment: "Ambient",
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: ParserModel.TESCO1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: null,
        type_of_treatment: "Ambient",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: "1",
        total_net_weight_kg: "0.798",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: ParserModel.TESCO1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [],
    registration_approval_number: null,
    parserModel: ParserModel.TESCO1,
  },
};
