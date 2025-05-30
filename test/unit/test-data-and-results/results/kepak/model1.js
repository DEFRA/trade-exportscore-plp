const parserModel = require("../../../../../app/services/parser-model");
const { emptyModelResult } = require("../davenport/model1");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "1602509590",
        description: "RS DOUBLE DECKER STD",
        nature_of_products: null,
        number_of_packages: 32,
        total_net_weight_kg: 30.336,
        type_of_treatment: null,
        country_of_origin: "GB",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "1602493000",
        description: "RS BBQ RIB STD 8X157G",
        nature_of_products: null,
        number_of_packages: 22,
        total_net_weight_kg: 27.632,
        type_of_treatment: null,
        country_of_origin: "GB",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: parserModel.KEPAK1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "1602495000",
        description: "FS MINI SAUSAGE BAP",
        nature_of_products: null,
        number_of_packages: 3,
        total_net_weight_kg: 2.16,
        type_of_treatment: null,
        country_of_origin: "GB",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "1602495000",
        description: "RS MEATBALL SUB",
        nature_of_products: null,
        number_of_packages: 3,
        total_net_weight_kg: 1.716,
        type_of_treatment: null,
        country_of_origin: "GB",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: parserModel.KEPAK1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Product description is missing in sheet "KEPAK" row 23.\nNo of packages is missing in sheet "KEPAK" row 22.\n',
    },
    items: [
      {
        commodity_code: "1602509590",
        description: "RS DOUBLE DECKER STD",
        nature_of_products: null,
        number_of_packages: null,
        total_net_weight_kg: 30.336,
        type_of_treatment: null,
        country_of_origin: "GB",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "1602493000",
        description: null,
        nature_of_products: null,
        number_of_packages: 22,
        total_net_weight_kg: 27.632,
        type_of_treatment: null,
        country_of_origin: "GB",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000280",
    parserModel: parserModel.KEPAK1,
  },
  emptyModelResult: {
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
        country_of_origin: null,
        total_net_weight_unit: null,
      },
    ],
    registration_approval_number: null,
    parserModel: parserModel.KEPAK1,
  },
};
