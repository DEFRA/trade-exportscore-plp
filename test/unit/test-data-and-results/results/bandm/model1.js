const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: 16025095,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.15,
        type_of_treatment: null,
        total_net_weight_unit: "KG",
      },
      {
        commodity_code: 19053199,
        description: "MINI ROLLS 10PK",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 3.27,
        type_of_treatment: null,
        total_net_weight_unit: "KG",
      },
    ],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: parserModel.BANDM1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: 16025095,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.15,
        type_of_treatment: null,
      },
      {
        commodity_code: 16041428,
        description: "JOHN W 5X132G S/WATER",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 8.1,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: parserModel.BANDM1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Net Weight Unit of Measure (kg) not found.\nIdentifier is missing in sheet "Sheet1" row 7.\nTotal net weight is missing in sheet "Sheet1" row 7.\n',
    },
    items: [
      {
        commodity_code: null,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: null,
        type_of_treatment: null,
      },
      {
        commodity_code: 19053199,
        description: "MINI ROLLS 10PK",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 3.27,
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: parserModel.BANDM1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [],
    registration_approval_number: null,
    parserModel: parserModel.BANDM1,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: 'Multiple GB Place of Dispatch (Establishment) numbers found on packing list.\n',
    },
    items: [
      {
        commodity_code: 16025095,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.15,
        type_of_treatment: null,
        total_net_weight_unit: "KG",
      }
    ],
    establishment_numbers: ['RMS-GB-000005-001', 'RMS-GB-000005-002'],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: parserModel.BANDM1,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: 'Net Weight Unit of Measure (kg) not found.\n',
    },
    items: [
      {
        commodity_code: 16025095,
        description: "J/L JERKY 70G TERIYAKI",
        nature_of_products: null,
        number_of_packages: 1,
        total_net_weight_kg: 1.15,
        type_of_treatment: null,
        total_net_weight_unit: null,
      }
    ],
     establishment_numbers: ['RMS-GB-000005-001'],
    registration_approval_number: "RMS-GB-000005-001",
    parserModel: parserModel.BANDM1,
  },
};
