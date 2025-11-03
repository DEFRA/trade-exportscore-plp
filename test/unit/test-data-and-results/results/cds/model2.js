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
        commodity_code: "3105209000",
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "1.9",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
      {
        commodity_code: "3105209000",
        description: "070398 - Amber Wood / Velvet Rose Oud Candle",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "24.7",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "3105209000",
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "1.9",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
      {
        commodity_code: "3105209000",
        description: "034581 - Carissa Planter Nest - Aqua",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "79.8",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },

  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Net Weight Unit of Measure (kg) not found.\nTotal net weight is missing in sheet "PackingList_Extract" row 2.\n',
    },
    items: [
      {
        commodity_code: "3105209000",
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: null,
        total_net_weight_unit: null,
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
      {
        commodity_code: "3105209000",
        description: "070398 - Amber Wood / Velvet Rose Oud Candle",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "24.7",
        total_net_weight_unit: null,
        type_of_treatment: null,
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },
  multipleRms: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: failureReasonsDescriptions.MULTIPLE_RMS,
    },
    items: [
      {
        commodity_code: "3105209000",
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "1.9",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
      {
        commodity_code: "3105209000",
        description: "070398 - Amber Wood / Velvet Rose Oud Candle",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "24.7",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },
  missingKgunit: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Net Weight Unit of Measure (kg) not found.\n",
    },
    items: [
      {
        commodity_code: "3105209000",
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "1.9",
        total_net_weight_unit: null,
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
      {
        commodity_code: "3105209000",
        description: "070398 - Amber Wood / Velvet Rose Oud Candle",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "24.7",
        total_net_weight_unit: null,
        type_of_treatment: "Ambient Goods",
        country_of_origin: "GB",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },
  emptyTestResultNoRemos: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons: "Check GB Establishment RMS Number.",
    },
    items: [],
    registration_approval_number: null,
    parserModel: "no-remos",
  },
  validTestResultWithNonNirmsNullCountryOfOrigin: {
    business_checks: {
      all_required_fields_present: true,
      failure_reasons: null,
    },
    items: [
      {
        commodity_code: "5555666677",
        description: "0205 - Fillers",
        nature_of_products: "General Retail Goods",
        number_of_packages: "1",
        total_net_weight_kg: "3.2",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: null,
      },
      {
        commodity_code: "7777888899",
        description: "0208 - Ready Made",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "8.9",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: "IT",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },
  invalidTestResultNirmsMissingCountryOfOrigin: {
    business_checks: {
      all_required_fields_present: false,
      failure_reasons:
        'Missing Country of Origin in sheet "PackingList_Extract" row 2.\n',
    },
    items: [
      {
        commodity_code: "1111222233",
        description: "0213 - Christmas Items",
        nature_of_products: "General Retail Goods",
        number_of_packages: "1",
        total_net_weight_kg: "2.1",
        total_net_weight_unit: "KG",
        type_of_treatment: "Ambient Goods",
        country_of_origin: null,
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS2,
  },
};
