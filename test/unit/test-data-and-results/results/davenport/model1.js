const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "709200010",
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        type_of_treatment: null,
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 30.0,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: ParserModel.DAVENPORT1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        type_of_treatment: null,
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: ParserModel.DAVENPORT1,
  },
};
