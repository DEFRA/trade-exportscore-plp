const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "Description",
        nature_of_products: "Description",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "CHILLED",
        total_net_weight_unit: "Kg",
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: "8",
        type_of_treatment: "FRESH PRODUCTS",
        total_net_weight_unit: "Kg",
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "28 TUNA CRUNCH TIGER ROLL",
        nature_of_products: "SANDWICHES",
        number_of_packages: "2",
        total_net_weight_kg: "0.26",
        type_of_treatment: "CHILLED",
        total_net_weight_unit: "Kg",
      },
      {
        commodity_code: "0210191000",
        description: "THICK CUT UNSMOKED BACON 20RAS",
        nature_of_products: "MEATS AND POULTRY",
        number_of_packages: "1",
        total_net_weight_kg: "10",
        type_of_treatment: "CHILLED",
        total_net_weight_unit: "Kg",
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: 'Total net weight is missing in sheet "Sheet1" row 3.\n',
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "Description",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        total_net_weight_unit: "Kg",
        type_of_treatment: null,
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: null,
        total_net_weight_unit: "Kg",
        type_of_treatment: "FRESH PRODUCTS",
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS1,
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
      },
    ],
    registration_approval_number: null,
    parserModel: parserModel.TJMORRIS1,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        "Multiple GB Place of Dispatch (Establishment) numbers found on packing list.\n",
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "Description",
        nature_of_products: "Description",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "CHILLED",
        total_net_weight_unit: "Kg",
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: "8",
        type_of_treatment: "FRESH PRODUCTS",
        total_net_weight_unit: "Kg",
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001", "RMS-GB-000010-002"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS1,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Net Weight Unit of Measure (kg) not found.\n",
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "Description",
        nature_of_products: "Description",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "CHILLED",
        total_net_weight_unit: null,
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: "8",
        type_of_treatment: "FRESH PRODUCTS",
        total_net_weight_unit: null,
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS1,
  },
};
