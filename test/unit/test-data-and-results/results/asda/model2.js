const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
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
    parserModel: ParserModel.ASDA2,
  },
  missingColumnData: {
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
    parserModel: ParserModel.ASDA2,
  },
  incorrectEstablishmentNumber: {},
  incorrectHeader,
  emptyModel: {
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
    parserModel: ParserModel.ASDA2,
  },
};
