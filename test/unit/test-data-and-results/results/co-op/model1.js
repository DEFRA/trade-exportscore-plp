const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
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
    parserModel: parser_model.COOP1,
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
    parserModel: parser_model.COOP1,
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
    parserModel: parser_model.COOP1,
  },
};
