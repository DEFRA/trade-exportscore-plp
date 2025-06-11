const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "1902209990",
        description: "SPINACH AND RICOTTA TORT",
        number_of_packages: 17,
        total_net_weight_kg: 40.8,
        nature_of_products: null,
        type_of_treatment: null,
        country_of_origin: "IT",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "1902209990",
        description: "FOUR CHEESE TORT",
        number_of_packages: 10,
        total_net_weight_kg: 24,
        nature_of_products: null,
        type_of_treatment: null,
        country_of_origin: "IT",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000153",
    parserModel: parserModel.GIOVANNI1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "1902209990",
        description: "RANA CHICKEN&BACON TORT",
        number_of_packages: 21,
        total_net_weight_kg: 31.5,
        nature_of_products: null,
        type_of_treatment: null,
        country_of_origin: "IT",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "1902209990",
        description: "RANA HAM&CHEESE TORT",
        number_of_packages: 10,
        total_net_weight_kg: 15,
        nature_of_products: null,
        type_of_treatment: null,
        country_of_origin: "IT",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000153",
    parserModel: parserModel.GIOVANNI1,
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
        country_of_origin: null,
      },
    ],
    registration_approval_number: null,
    parserModel: parserModel.GIOVANNI1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'No of packages is missing in sheet "RANA" row 3.\nTotal net weight is missing in sheet "RANA" row 4.\n',
    },
    items: [
      {
        commodity_code: "1902209990",
        description: "SPINACH AND RICOTTA TORT",
        number_of_packages: null,
        total_net_weight_kg: 40.8,
        total_net_weight_unit: "KG",
        nature_of_products: null,
        type_of_treatment: null,
        country_of_origin: "IT",
      },
      {
        commodity_code: "1902209990",
        description: "FOUR CHEESE TORT",
        number_of_packages: 10,
        total_net_weight_kg: null,
        total_net_weight_unit: "KG",
        nature_of_products: null,
        type_of_treatment: null,
        country_of_origin: "IT",
      },
    ],
    registration_approval_number: "RMS-GB-000153",
    parserModel: parserModel.GIOVANNI1,
  },
  incorrectEstablishmentNumber: {
    RANA: [
      {
        A: "INCORRECT",
      },
    ],
  },
  incorrectHeader: {
    RANA: [
      {
        A: "RMS-GB-000153",
      },
      {
        C: "DESCRIPTION",
        G: "CORRECT",
        H: "HEADER",
        E: "Commodity Code",
      },
    ],
  },
};
