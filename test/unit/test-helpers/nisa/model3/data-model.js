const ParserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validModel: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: 2.5,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: "0403209300",
        G: 1,
        I: 2,
      },
    ],
  },
  invalidModel_MissingColumnCells: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
      },
      {
        A: "RMS-GB-000025-003",
      },
      {
        C: "PRODUCT TYPE CATEGORY",
        E: "PART NUMBER DESCRIPTION",
        F: "TARIFF CODE EU",
        G: "PACKAGES",
        I: "NET WEIGHT TOTAL",
      },
      {
        C: "PRODUCT_TYPE_CATEGORY675 - CHEESE - C",
        E: "DAIRYLEA DUNKERS JUMBO PM80P",
        F: "2005995090",
        G: 2,
        I: null,
      },
      {
        C: "900 - VEGETABLES PREPACK-C",
        E: "NISA BROCCOLI",
        F: null,
        G: 1,
        I: 2,
      },
    ],
  },
  emptyModel: {
    sheet: [
      {
        A: "RMS_ESTABLISHMENT_NO",
        I: "PRODUCT_TYPE_CATEGORY",
        K: "PART_NUMBER_DESCRIPTION",
        L: "TARIFF_CODE_EU",
        M: "PACKAGES",
        O: "NET_WEIGHT_TOTAL",
      },
      {
        A: null,
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
    registration_approval_number: "RMS-GB-000025-003",
    parserModel: ParserModel.NISA3,
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
    parserModel: ParserModel.NISA3,
  },
};
