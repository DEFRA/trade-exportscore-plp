const ParserModel = require("../../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: 12,
        S: 12,
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Ripe And Ready To Eat Avocados 2S.",
        P: "0709601001",
        Q: 1,
        S: 1,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Red Peppers Each",
        P: "0709601000",
        Q: null,
        S: 12,
      },
      {
        E: "RMS-GB-000009-001",
        O: "Co-op Ripe And Ready To Eat Avocados 2S.",
        P: null,
        Q: 1,
        S: 1,
      },
    ],
  },
  emptyModel: {
    "Input Packing Sheet": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
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
        commodity_code: "0709601000",
        description: "Co-op Red Peppers Each",
        nature_of_products: null,
        number_of_packages: 12,
        total_net_weight_kg: 12,
        type_of_treatment: null,
      },
      {
        commodity_code: "0709601001",
        description: "Co-op Ripe And Ready To Eat Avocados 2S.",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000009-001",
    parserModel: ParserModel.COOP1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "0709601000",
        description: "Co-op Red Peppers Each",
        nature_of_products: null,
        number_of_packages: null,
        total_net_weight_kg: 12,
        type_of_treatment: null,
      },
      {
        commodity_code: null,
        description: "Co-op Ripe And Ready To Eat Avocados 2S.",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000009-001",
    parserModel: ParserModel.COOP1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: null,
        nature_of_products: null,
        number_of_packages: null,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: null,
    parserModel: ParserModel.COOP1,
  },
};
