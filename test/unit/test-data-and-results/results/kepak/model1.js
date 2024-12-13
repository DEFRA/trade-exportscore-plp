const parserModel = require("../../../../../app/services/parser-model");
const { emptyModelResult } = require("../davenport/model1");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "1602509590",
        description: "RS DOUBLE DECKER STD",
        nature_of_products: null,
        number_of_packages: 32,
        total_net_weight_kg: 30.336,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602493000",
        description: "RS BBQ RIB STD 8X157G",
        nature_of_products: null,
        number_of_packages: 22,
        total_net_weight_kg: 27.632,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: parserModel.KEPAK1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: "1602495000",
        description: "FS MINI SAUSAGE BAP",
        nature_of_products: null,
        number_of_packages: 3,
        total_net_weight_kg: 2.16,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602495000",
        description: "RS MEATBALL SUB",
        nature_of_products: null,
        number_of_packages: 3,
        total_net_weight_kg: 1.716,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: parserModel.KEPAK1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Description is missing in row 1.\nNo of packages is missing in row 0.\n",
    },
    items: [
      {
        commodity_code: "1602509590",
        description: "RS DOUBLE DECKER STD",
        nature_of_products: null,
        number_of_packages: null,
        total_net_weight_kg: 30.336,
        type_of_treatment: null,
      },
      {
        commodity_code: "1602493000",
        description: null,
        nature_of_products: null,
        number_of_packages: 22,
        total_net_weight_kg: 27.632,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: parserModel.KEPAK1,
  },
  emptyModelResult: {
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
    parserModel: parserModel.KEPAK1,
  },
};
