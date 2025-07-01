const parserModel = require("../../../../../app/services/parser-model");
const { multipleRms } = require("../../models/tjmorris/model2");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "2 WEB LICK-E-LIX 5S BEEF",
        nature_of_products: "PET FOOD & HEALTHCARE",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "RAW",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: "8",
        type_of_treatment: "FRESH PRODUCTS",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS2,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "2 WEB LICK-E-LIX 5S BEEF",
        nature_of_products: "PET FOOD & HEALTHCARE",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "RAW",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: "8",
        type_of_treatment: "FRESH PRODUCTS",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS2,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: 'Total net weight is missing in sheet "Sheet1" row 3.\n',
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "2 WEB LICK-E-LIX 5S BEEF",
        nature_of_products: "PET FOOD & HEALTHCARE",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "RAW",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
      {
        commodity_code: "1602906100",
        description: "FLORETTE SWEET & CRUNCHY 250G",
        nature_of_products: "LETTUCE & BAGGED SALADS",
        number_of_packages: "4",
        total_net_weight_kg: null,
        type_of_treatment: "FRESH PRODUCTS",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS2,
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
    parserModel: parserModel.TJMORRIS2,
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
        description: "2 WEB LICK-E-LIX 5S BEEF",
        nature_of_products: "PET FOOD & HEALTHCARE",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "RAW",
        total_net_weight_unit: "Kg",
        country_of_origin: "GB",
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001", "RMS-GB-000010-002"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS2,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Net Weight Unit of Measure (kg) not found.\n",
    },
    items: [
      {
        commodity_code: "0408192000",
        description: "2 WEB LICK-E-LIX 5S BEEF",
        nature_of_products: "PET FOOD & HEALTHCARE",
        number_of_packages: "2",
        total_net_weight_kg: "1.4",
        type_of_treatment: "RAW",
        total_net_weight_unit: null,
        country_of_origin: "GB",
      },
    ],
    establishment_numbers: ["RMS-GB-000010-001"],
    registration_approval_number: "RMS-GB-000010-001",
    parserModel: parserModel.TJMORRIS2,
  },
};
