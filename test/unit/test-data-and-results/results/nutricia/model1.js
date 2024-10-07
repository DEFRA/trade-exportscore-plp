const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "403209300",
        description: "ACTIVIA DRK FRTS 6X8X115",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 11.04,
        type_of_treatment: null,
      },
      {
        commodity_code: "403209100",
        description: "ACT 00  YE&RD FRU 6X8X115",
        nature_of_products: null,
        number_of_packages: 5,
        total_net_weight_kg: 27.6,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000133",
    parserModel: parser_model.NUTRICIA1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "403209300",
        description: "ACTIVIA DRK FRTS 6X8X115",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 11.04,
        type_of_treatment: null,
      },
      {
        commodity_code: "403209100",
        description: "ACT 00  YE&RD FRU 6X8X115",
        nature_of_products: null,
        number_of_packages: 5,
        total_net_weight_kg: 27.6,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000133",
    parserModel: parser_model.NUTRICIA1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "ACTIVIA DRK FRTS 6X8X115",
        nature_of_products: null,
        number_of_packages: 2,
        total_net_weight_kg: 11.04,
        type_of_treatment: null,
      },
      {
        commodity_code: "403209100",
        description: "ACT 00  YE&RD FRU 6X8X115",
        nature_of_products: null,
        number_of_packages: 5,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000133",
    parserModel: parser_model.NUTRICIA1,
  },
  emptyModelResult: {
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
    parserModel: parser_model.NUTRICIA1,
  },
};
