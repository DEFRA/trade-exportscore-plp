const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "4PK X 17 PINK LADY APPLES",
        nature_of_products: "TOP FRUIT",
        number_of_packages: 20,
        total_net_weight_kg: 255,
        type_of_treatment: "PRODUCE",
      },
      {
        commodity_code: null,
        description: "ASDA BABY WATERMELON X10",
        nature_of_products: "MELON HARD",
        number_of_packages: 5,
        total_net_weight_kg: 60,
        type_of_treatment: "PRODUCE",
      },
    ],
    registration_approval_number: "RMS-GB-000015-010",
    parserModel: parser_model.ASDA2,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "4PK X 17 PINK LADY APPLES",
        nature_of_products: "TOP FRUIT",
        number_of_packages: 20,
        total_net_weight_kg: 255,
        type_of_treatment: "PRODUCE",
      },
      {
        commodity_code: null,
        description: "ASDA BERRIES TWIN PACK 12X200G",
        nature_of_products: "BERRIES",
        number_of_packages: 1,
        total_net_weight_kg: 3,
        type_of_treatment: "PRODUCE",
      },
    ],
    registration_approval_number: "RMS-GB-000015-010",
    parserModel: ParserModel.ASDA2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "4PK X 17 PINK LADY APPLES",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 255,
        type_of_treatment: "PRODUCE",
      },
      {
        commodity_code: null,
        description: "ASDA BABY WATERMELON X10",
        nature_of_products: "MELON HARD",
        number_of_packages: 5,
        total_net_weight_kg: 60,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000015-010",
    parserModel: parser_model.ASDA2,
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
    parserModel: parser_model.ASDA2,
  },
};
