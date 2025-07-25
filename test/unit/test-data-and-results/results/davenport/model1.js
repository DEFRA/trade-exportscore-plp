const parserModel = require("../../../../../app/services/parser-model");

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
    parserModel: parserModel.DAVENPORT1,
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
    parserModel: parserModel.DAVENPORT1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Identifier is missing in sheet "Customer_Order" row 46.\nTotal net weight is missing in sheet "Customer_Order" row 47.\n',
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
    parserModel: parserModel.DAVENPORT1,
  },
  emptyModelResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT1,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        "Multiple GB Place of Dispatch (Establishment) numbers found on packing list.\n",
    },
    items: [
      {
        description: "ASPARAGUS BUNDLE",
        commodity_code: "709200010",
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: "kgs",
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    establishment_numbers: ["RMS-GB-000323-001", "RMS-GB-000323-002"],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT1,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Net Weight Unit of Measure (kg) not found.\n",
    },
    items: [
      {
        description: "ASPARAGUS BUNDLE",
        commodity_code: "709200010",
        number_of_packages: 160,
        total_net_weight_kg: 40.0,
        total_net_weight_unit: null,
        nature_of_products: null,
        type_of_treatment: null,
      },
    ],
    establishment_numbers: ["RMS-GB-000323-001"],
    registration_approval_number: "RMS-GB-000323-001",
    parserModel: parserModel.DAVENPORT1,
  },
};
