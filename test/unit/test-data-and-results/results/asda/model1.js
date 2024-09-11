const ParserModel = require("../../../../../app/services/parser-model");

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
    parserModel: ParserModel.ASDA1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [],
    registration_approval_number: null,
    parserModel: ParserModel.ASDA1,
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
    parserModel: ParserModel.ASDA1,
  },
};
