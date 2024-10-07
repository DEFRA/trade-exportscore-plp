const parser_model = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "DAIRYLEA DUNKERS JUMBO PM80P",
        nature_of_products: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        number_of_packages: 2,
        total_net_weight_kg: 2.5,
        type_of_treatment: null,
      },
      {
        commodity_code: "0403209300",
        description: "NISA BROCCOLI",
        nature_of_products: "900 - VEGETABLES PREPACK-C",
        number_of_packages: 1,
        total_net_weight_kg: 2,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000025-003",
    parserModel: parser_model.NISA2,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "2004909880",
        description: "GREEN ISLE BATTERED ONION RING",
        nature_of_products: "500 - VEGETABLES - F",
        number_of_packages: 9,
        total_net_weight_kg: 63,
        type_of_treatment: null,
      },
      {
        commodity_code: "2004109900",
        description: "MCCAIN READY BAKED JACKETS 4PK",
        nature_of_products: "515 - F/P POTATOES - F",
        number_of_packages: 28,
        total_net_weight_kg: 176.4,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000025-003",
    parserModel: ParserModel.NISA2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "DAIRYLEA DUNKERS JUMBO PM80P",
        nature_of_products: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        number_of_packages: 2,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
      {
        commodity_code: null,
        description: "NISA BROCCOLI",
        nature_of_products: "900 - VEGETABLES PREPACK-C",
        number_of_packages: 1,
        total_net_weight_kg: 2,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000025-003",
    parserModel: parser_model.NISA2,
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
    parserModel: parser_model.NISA2,
  },
};
