const parserModel = require("../../../../../app/services/parser-model");
const failureReasonsDescriptions = require("../../../../../app/services/validators/packing-list-failure-reasons");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "709200010",
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 30.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
    ],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT2,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "709200010",
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 30.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
    ],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Identifier is missing in sheet "Revised" row 46.\nTotal net weight is missing in sheet "Revised" row 47.\n',
    },
    items: [
      {
        commodity_code: null,
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: null,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
    ],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT2,
  },
  emptyModelResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT2,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: failureReasonsDescriptions.MULTIPLE_RMS,
    },
    items: [
      {
        commodity_code: "709200010",
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 30.0,
        total_net_weight_unit: "kgs",
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
    ],
    establishment_numbers: ["RMS-GB-000323-001", "RMS-GB-000323-002"],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT2,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Net Weight Unit of Measure (kg) not found.\n",
    },
    items: [
      {
        commodity_code: "709200010",
        description: "ASPARAGUS BUNDLE",
        nature_of_products: null,
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: null,
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
      {
        commodity_code: "709599000",
        description: "OYSTER MUSHROOM",
        nature_of_products: null,
        number_of_packages: 20,
        total_net_weight_kg: 30.0,
        total_net_weight_unit: null,
        type_of_treatment: null,
        country_of_origin: "Great Britain",
      },
    ],
    establishment_numbers: ["RMS-GB-000323-001"],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT2,
  },
};
