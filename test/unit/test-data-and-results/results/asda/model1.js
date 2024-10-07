const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "169 STOREY TREEHOUSE",
        nature_of_products: "BOOKS",
        number_of_packages: 2,
        total_net_weight_kg: 0.38,
        type_of_treatment: "GM",
      },
      {
        commodity_code: null,
        description: "19 CRIMES",
        nature_of_products: "WINES",
        number_of_packages: 1,
        total_net_weight_kg: 0.3457,
        type_of_treatment: "AMBIENT",
      },
    ],
    registration_approval_number: "RMS-GB-000015-006",
    parserModel: parser_model.ASDA1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "A BESSIES APPLE PIE",
        nature_of_products: "DESSERTS & ICE CREAM",
        number_of_packages: 1,
        total_net_weight_kg: 4.2,
        type_of_treatment: "FROZEN",
      },
      {
        commodity_code: null,
        description: "A BESSIES ROASTS",
        nature_of_products: "CHIPS/POTATOES & VEG",
        number_of_packages: 1,
        total_net_weight_kg: 10.3,
        type_of_treatment: "FROZEN",
      },
      {
        commodity_code: null,
        description: "ASDA BROOKIE BITES",
        nature_of_products: "CAKES IS",
        number_of_packages: 2,
        total_net_weight_kg: 4.32,
        type_of_treatment: "FRESH",
      },
      {
        commodity_code: null,
        description: "ASDA BROWNIE CAKE",
        nature_of_products: "CAKES/CHILLED BI",
        number_of_packages: 1,
        total_net_weight_kg: 2.68,
        type_of_treatment: "FRESH",
      },
    ],
    registration_approval_number: "RMS-GB-000015-005",
    parserModel: ParserModel.ASDA1,
  },
  validParserResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "169 STOREY TREEHOUSE",
        nature_of_products: "BOOKS",
        number_of_packages: 2,
        total_net_weight_kg: 0.38,
        type_of_treatment: "GM",
      },
      {
        commodity_code: null,
        description: "19 CRIMES",
        nature_of_products: "WINES",
        number_of_packages: 1,
        total_net_weight_kg: 0.3457,
        type_of_treatment: "AMBIENT",
      },
    ],
    registration_approval_number: "RMS-GB-000015-006",
    parserModel: parser_model.ASDA1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [],
    registration_approval_number: null,
    parserModel: parser_model.ASDA1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "169 STOREY TREEHOUSE",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 0.38,
        type_of_treatment: "GM",
      },
      {
        commodity_code: null,
        description: "19 CRIMES",
        nature_of_products: "WINES",
        number_of_packages: 1,
        total_net_weight_kg: 0.3457,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000015-001",
    parserModel: parser_model.ASDA1,
  },
};
