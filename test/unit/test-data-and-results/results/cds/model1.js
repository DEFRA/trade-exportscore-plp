const parserModel = require("../../../../../app/services/parser-model");

module.exports = {
  validTestResult: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "1.9",
        type_of_treatment: "Ambient Goods",
      },
      {
        commodity_code: null,
        description: "070398 - Amber Wood / Velvet Rose Oud Candle",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "24.7",
        type_of_treatment: "Ambient Goods",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS1,
  },
  validTestResultForMultipleSheets: {
    business_checks: {
      all_required_fields_present: true,
    },
    items: [
      {
        commodity_code: null,
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: "1.9",
        type_of_treatment: "Ambient Goods",
      },
      {
        commodity_code: null,
        description: "034581 - Carissa Planter Nest - Aqua",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "79.8",
        type_of_treatment: "Ambient Goods",
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS1,
  },
  invalidTestResult_MissingCells: {
    business_checks: {
      all_required_fields_present: false,
    },
    items: [
      {
        commodity_code: null,
        description: "002541 - Tapered Slate Small Planter Ash",
        nature_of_products: "General Retail Goods",
        number_of_packages: "2",
        total_net_weight_kg: null,
        type_of_treatment: "Ambient Goods",
      },
      {
        commodity_code: null,
        description: "070398 - Amber Wood / Velvet Rose Oud Candle",
        nature_of_products: "General Retail Goods",
        number_of_packages: "4",
        total_net_weight_kg: "24.7",
        type_of_treatment: null,
      },
    ],
    registration_approval_number: "RMS-GB-000252-002",
    parserModel: parserModel.CDS1,
  },
  emptyTestResult: {
    business_checks: {
      all_required_fields_present: true,
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
    parserModel: parserModel.CDS1,
  },
};
