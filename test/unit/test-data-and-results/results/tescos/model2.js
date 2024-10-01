const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "TF R/Bow Tom with Blsac Glze 340g x4",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "9.312",
        type_of_treatment: null,
      },
      {
        commodity_code: "2005995090",
        description: "TF 300g Roasting Vegetables x8",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "16.144",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "TF R/Bow Tom with Blsac Glze 340g x4",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
      {
        commodity_code: null,
        description: "TF 300g Roasting Vegetables x8",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "16.144",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
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
    parserModel: parserModel.TESCO2,
  },
};
