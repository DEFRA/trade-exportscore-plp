const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.4155,
        type_of_treatment: "Ambient",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.798,
        type_of_treatment: "Ambient",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: parserModel.TESCO1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.4155,
        type_of_treatment: "Ambient",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.798,
        type_of_treatment: "Ambient",
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: parserModel.TESCO1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Total net weight is missing in sheet "Input Data Sheet" row 6.\n',
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: null,
        type_of_treatment: "Ambient",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.798,
        type_of_treatment: null,
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: parserModel.TESCO1,
  },
  invalidTestResult_MissingCellsInParse: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "9617000000",
        description: "CONTIGO AUTO-POP BOTTLE 720ML",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: null,
        type_of_treatment: "Ambient",
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: "3924100090",
        description: "JOIE MEASURING SPOONS",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 0.798,
        type_of_treatment: null,
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000022-998",
    parserModel: parserModel.TESCO1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: null,
    parserModel: parserModel.TESCO1,
  },
};
