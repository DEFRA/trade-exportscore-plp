const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "TF R/Bow Tom with Blsac Glze 340g x4",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "9.312",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
      {
        commodity_code: "2005995090",
        description: "TF 300g Roasting Vegetables x8",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "16.144",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
    ],
    establishment_numbers: ["RMS-GB-000015-009"],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "709200010",
        description: "TS Asp Bundles 180g",
        nature_of_products: null,
        number_of_packages: "144",
        total_net_weight_kg: "25.92",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
      {
        commodity_code: "709200010",
        description: "TS Asp Tips Exp 125g",
        nature_of_products: null,
        number_of_packages: "90",
        total_net_weight_kg: "11.25",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
    ],
    establishment_numbers: ["RMS-GB-000015-009"],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Identifier is missing in sheet "Sheet2" row 4.\nTotal net weight is missing in sheet "Sheet2" row 3.\n',
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "TF R/Bow Tom with Blsac Glze 340g x4",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: null,
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
      {
        commodity_code: null,
        description: "TF 300g Roasting Vegetables x8",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "16.144",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
    ],
    establishment_numbers: ["RMS-GB-000015-009"],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
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
    parserModel: parserModel.TESCO2,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        "Multiple GB Place of Dispatch (Establishment) numbers found on packing list.\n",
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "TF R/Bow Tom with Blsac Glze 340g x4",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "9.312",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
      {
        commodity_code: "2005995090",
        description: "TF 300g Roasting Vegetables x8",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "16.144",
        type_of_treatment: null,
        total_net_weight_unit: "kgs",
      },
    ],
    establishment_numbers: ["RMS-GB-000015-009", "RMS-GB-000015-010"],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Net Weight Unit of Measure (kg) not found.\n",
    },
    items: [
      {
        commodity_code: "2005995090",
        description: "TF R/Bow Tom with Blsac Glze 340g x4",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "9.312",
        type_of_treatment: null,
        total_net_weight_unit: null,
      },
      {
        commodity_code: "2005995090",
        description: "TF 300g Roasting Vegetables x8",
        nature_of_products: null,
        number_of_packages: "4",
        total_net_weight_kg: "16.144",
        type_of_treatment: null,
        total_net_weight_unit: null,
      },
    ],
    establishment_numbers: ["RMS-GB-000015-009"],
    registration_approval_number: "RMS-GB-000015-009",
    parserModel: parserModel.TESCO2,
  },
};
