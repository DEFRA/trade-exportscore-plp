const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "0709991000",
        description: "JS Chicken Korma 400g",
        nature_of_products: "Chilled Indian Meals",
        number_of_packages: 1,
        total_net_weight_kg: 3.15,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602323090",
        description: "JS TTD Gunpowder Potatoes 250g",
        nature_of_products: "Chilled Indian Meals",
        number_of_packages: 2,
        total_net_weight_kg: 1.4,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000094-002",
    parserModel: parserModel.SAINSBURYS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "0709991000",
        description: "JS Chicken Korma 400g",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 3.15,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602323090",
        description: "JS TTD Gunpowder Potatoes 250g",
        nature_of_products: "Chilled Indian Meals",
        number_of_packages: 2,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000094-002",
    parserModel: parserModel.SAINSBURYS1,
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
    parserModel: parserModel.SAINSBURYS1,
  },
};
