const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    "Customer Order": [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: 2,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "NISA BROCCOLI",
        L: "0403209300",
        M: 1,
        O: 2,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    "Customer Order": [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: "RMS-GB-000025-001",
        I: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        K: "DAIRYLEA DUNKERS JUMBO PM80P",
        L: "2005995090",
        M: null,
        O: 2.5,
      },
      {
        A: "RMS-GB-000025-001",
        I: "900 - VEGETABLES PREPACK-C",
        K: "NISA BROCCOLI",
        L: "0403209300",
        M: 1,
        O: null,
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
    parserModel: ParserModel.NISA1,
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
        number_of_packages: null,
        total_net_weight_kg: 2.5,
        type_of_treatment: null,
      },
      {
        commodity_code: "0403209300",
        description: "NISA BROCCOLI",
        nature_of_products: "900 - VEGETABLES PREPACK-C",
        number_of_packages: 1,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000025-001",
    parserModel: ParserModel.NISA1,
  },
};
