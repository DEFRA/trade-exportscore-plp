/**
 * Gousto Model 1 expected test results
 *
 * Expected parser output for corresponding test data models.
 */
const parserModel = require("../../../../../app/services/parser-model");

const validTestResult = {
  registration_approval_number: "RMS-GB-000483-001",
  items: [
    {
      description: "Fresh Salmon Fillets",
      nature_of_products: "Fish",
      type_of_treatment: "Chilled",
      commodity_code: "03021200",
      number_of_packages: "10",
      total_net_weight_kg: "5.5",
      total_net_weight_unit: "KG",
      country_of_origin: "GB",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 6,
        sheetName: "Packing List",
      },
    },
    {
      description: "Organic Chicken Breast",
      nature_of_products: "Poultry",
      type_of_treatment: "Frozen",
      commodity_code: "02071410",
      number_of_packages: "20",
      total_net_weight_kg: "12.0",
      total_net_weight_unit: "KG",
      country_of_origin: "DE",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 7,
        sheetName: "Packing List",
      },
    },
    {
      description: "Mixed Vegetables",
      nature_of_products: "Vegetables",
      type_of_treatment: "Fresh",
      commodity_code: "07099990",
      number_of_packages: "15",
      total_net_weight_kg: "8.3",
      total_net_weight_unit: "KG",
      country_of_origin: "NL",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 8,
        sheetName: "Packing List",
      },
    },
  ],
  business_checks: {
    all_required_fields_present: true,
    failure_reasons: null,
  },
  parserModel: parserModel.GOUSTO1,
  establishment_numbers: ["RMS-GB-000483-001"],
};

const validTestResultWithBoxNumber = {
  registration_approval_number: "RMS-GB-000483-001",
  items: [
    {
      description: "Fresh Salmon Fillets",
      nature_of_products: "Fish",
      type_of_treatment: "Chilled",
      commodity_code: "03021200",
      number_of_packages: "10",
      total_net_weight_kg: "5.5",
      total_net_weight_unit: "KG",
      country_of_origin: "GB",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 4,
        sheetName: "Packing List",
      },
    },
    {
      description: "Organic Chicken Breast",
      nature_of_products: "Poultry",
      type_of_treatment: "Frozen",
      commodity_code: "02071410",
      number_of_packages: "20",
      total_net_weight_kg: "12.0",
      total_net_weight_unit: "KG",
      country_of_origin: "DE",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 6,
        sheetName: "Packing List",
      },
    },
  ],
  business_checks: {
    all_required_fields_present: true,
    failure_reasons: null,
  },
  parserModel: parserModel.GOUSTO1,
  establishment_numbers: ["RMS-GB-000483-001"],
};

const missingDescriptionResult = {
  registration_approval_number: "RMS-GB-000483-001",
  items: [
    {
      description: "",
      nature_of_products: "Fish",
      type_of_treatment: "Chilled",
      commodity_code: "03021200",
      number_of_packages: "10",
      total_net_weight_kg: "5.5",
      total_net_weight_unit: "KG",
      country_of_origin: "GB",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 4,
        sheetName: "Packing List",
      },
    },
  ],
  business_checks: {
    all_required_fields_present: false,
    failure_reasons:
      'Product description is missing in sheet "Packing List" row 4.\n',
  },
  parserModel: parserModel.GOUSTO1,
  establishment_numbers: ["RMS-GB-000483-001"],
};

const missingCountryOfOriginResult = {
  registration_approval_number: "RMS-GB-000483-001",
  items: [
    {
      description: "Fresh Salmon",
      nature_of_products: "Fish",
      type_of_treatment: "Chilled",
      commodity_code: "03021200",
      number_of_packages: "10",
      total_net_weight_kg: "5.5",
      total_net_weight_unit: "KG",
    },
  ],
  business_checks: {
    all_required_fields_present: false,
    failure_reasons: null,
  },
  parserModel: parserModel.GOUSTO1,
  establishment_numbers: ["RMS-GB-000483-001"],
};

const validCountryOfOriginPlaceholderResult = {
  registration_approval_number: "RMS-GB-000483-001",
  items: [
    {
      description: "Fresh Salmon",
      nature_of_products: "Fish",
      type_of_treatment: "Chilled",
      commodity_code: "03021200",
      number_of_packages: "10",
      total_net_weight_kg: "5.5",
      total_net_weight_unit: "KG",
      country_of_origin: "X",
      nirms: "NIRMS",
      row_location: {
        rowNumber: 4,
        sheetName: "Packing List",
      },
    },
  ],
  business_checks: {
    all_required_fields_present: true,
    failure_reasons: null,
  },
  parserModel: parserModel.GOUSTO1,
  establishment_numbers: ["RMS-GB-000483-001"],
};

const noMatchResult = {
  registration_approval_number: null,
  items: [],
  business_checks: {
    all_required_fields_present: false,
    failure_reasons: null,
  },
  parserModel: parserModel.NOMATCH,
  establishment_numbers: [],
};

module.exports = {
  validTestResult,
  validTestResultWithBoxNumber,
  missingDescriptionResult,
  missingCountryOfOriginResult,
  validCountryOfOriginPlaceholderResult,
  noMatchResult,
};
