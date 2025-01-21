const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "0702000007",
        description: "Nightingale Cherry Tomatoes TS 42x250g",
        nature_of_products: null,
        number_of_packages: "32",
        total_net_weight_kg: "336",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "0702000007",
        description: "Cherry Tomatoes TS Core 30x300G",
        nature_of_products: null,
        number_of_packages: "39",
        total_net_weight_kg: "351",
        type_of_treatment: "Chilled",
      },
    ],
    registration_approval_number: "RMS-GB-000174-002",
    parserModel: parserModel.WARRENS1,
  },
  validTestResultMultiple: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "0702000007",
        description: "Nightingale Cherry Tomatoes TS 42x250g",
        nature_of_products: null,
        number_of_packages: "32",
        total_net_weight_kg: "336",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "0702000007",
        description: "Cherry Tomatoes TS Core 30x300G",
        nature_of_products: null,
        number_of_packages: "39",
        total_net_weight_kg: "351",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "2005800099",
        description: "Sweetcorn Express 8x2",
        nature_of_products: null,
        number_of_packages: "5",
        total_net_weight_kg: "20.000",
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "2005800099",
        description: "Sweetcorn Cobettes 24x4",
        nature_of_products: null,
        number_of_packages: "65",
        total_net_weight_kg: "780.000",
        type_of_treatment: "Chilled",
      },
    ],
    registration_approval_number: "RMS-GB-000174-002",
    parserModel: parserModel.WARRENS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Total net weight is missing in row 1.\n",
    },
    items: [
      {
        commodity_code: "0702000007",
        description: "Nightingale Cherry Tomatoes TS 42x250g",
        nature_of_products: null,
        number_of_packages: "32",
        total_net_weight_kg: null,
        type_of_treatment: "Chilled",
      },
      {
        commodity_code: "0702000007",
        description: "Cherry Tomatoes TS Core 30x300G",
        nature_of_products: null,
        number_of_packages: "39",
        total_net_weight_kg: "351",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000174-002",
    parserModel: parserModel.WARRENS1,
  },
  emptyFile: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    parserModel: "warrens-1",
    registration_approval_number: null,
  },
};
