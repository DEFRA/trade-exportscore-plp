const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Customer Order": [
      {
        B: "RMS_ESTABLISHMENT_NO",
        J: "PRODUCT_TYPE_CATEGORY",
        L: "PART_NUMBER_DESCRIPTION",
        M: "TARIFF_CODE_EU",
        N: "PACKAGES",
        P: "NET_WEIGHT_TOTAL",
      },
      {
        B: "RMS-GB-000025-001",
        J: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        L: "DAIRYLEA DUNKERS JUMBO PM80P",
        M: "2005995090",
        N: 2,
        P: 2.5,
      },
      {
        B: "RMS-GB-000025-001",
        J: "900 - VEGETABLES PREPACK-C",
        L: "NISA BROCCOLI",
        M: "0403209300",
        N: 1,
        P: 2,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Customer Order": [
      {
        B: "RMS_ESTABLISHMENT_NO",
        J: "PRODUCT_TYPE_CATEGORY",
        L: "PART_NUMBER_DESCRIPTION",
        M: "TARIFF_CODE_EU",
        N: "PACKAGES",
        P: "NET_WEIGHT_TOTAL",
      },
      {
        B: "RMS-GB-000025-001",
        J: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        L: "DAIRYLEA DUNKERS JUMBO PM80P",
        M: "2005995090",
        N: 2,
        P: null,
      },
      {
        B: "RMS-GB-000025-001",
        J: "900 - VEGETABLES PREPACK-C",
        L: "NISA BROCCOLI",
        M: null,
        N: 1,
        P: 2,
      },
    ],
  },
  emptyModel: {
    "Customer Order": [
      {
        E: "Dispatch RMS Establishment",
        O: "Product/ Part Number description",
        P: "Tariff Code EU",
        Q: "Packages",
        S: "NW total",
      },
      {
        E: null,
      },
    ],
  },
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
    registration_approval_number: "RMS-GB-000025-001",
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
    registration_approval_number: "RMS-GB-000025-001",
    parserModel: ParserModel.NISA2,
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
    parserModel: ParserModel.NISA2,
  },
};
