const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "21032000",
        description: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        number_of_packages: 8,
        total_net_weight_kg: 24.0,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "19049010",
        description: "BEN Mexican 6*220g GB",
        number_of_packages: 336,
        total_net_weight_kg: 443.52,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000213-001",
    parserModel: parserModel.MARS1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "21032000",
        description: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        number_of_packages: 8,
        total_net_weight_kg: 24.0,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "19049010",
        description: "BEN Mexican 6*220g GB",
        number_of_packages: 336,
        total_net_weight_kg: 443.52,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "21032000",
        description: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        number_of_packages: 8,
        total_net_weight_kg: 24.0,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "19049010",
        description: "BEN Mexican 6*220g GB",
        number_of_packages: 336,
        total_net_weight_kg: 443.52,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000213-001",
    parserModel: parserModel.MARS1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
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
    parserModel: parserModel.MARS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        "No of packages is missing in row 4.\nTotal net weight is missing in row 5.\n",
    },
    items: [
      {
        commodity_code: "21032000",
        description: "DO BOL ORIGINAL LIGHT 6X500G GB/IR",
        number_of_packages: null,
        total_net_weight_kg: 24.0,
        nature_of_products: null,
        type_of_treatment: null,
      },
      {
        commodity_code: "19049010",
        description: "BEN Mexican 6*220g GB",
        number_of_packages: 336,
        total_net_weight_kg: null,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000213-001",
    parserModel: parserModel.MARS1,
  },
};
