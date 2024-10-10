const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
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
    parserModel: parser_model.BANDM1,
  },
  validTestResultForMultipleSheets: {
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
        commodity_code: 16041428,
        description: "JOHN W 5X132G S/WATER",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 8.1,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: parser_model.BANDM1,
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
    parserModel: parser_model.BANDM1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [],
    registration_approval_number: null,
    parserModel: parser_model.BANDM1,
  },
};
